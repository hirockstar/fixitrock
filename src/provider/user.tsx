'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { addToast } from '@heroui/react'

import { userSession, startSession } from '®actions/auth'
import { signOut as serverSignOut } from '®actions/auth'
import { User } from '®app/login/types'
import { firebaseAuth } from '®firebase/client'
import { logWarning } from '®lib/utils'

// WARNING: idToken is stored in context. Ensure your app is XSS-safe!

interface UserContextType {
    user: User | null
    loading: boolean
    signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

function getTokenExpiry(idToken: string): number | null {
    try {
        const payload = JSON.parse(atob(idToken.split('.')[1]))

        return payload.exp ? payload.exp * 1000 : null
    } catch {
        return null
    }
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [idToken, setIdToken] = useState<string | null>(null)
    const [sessionExpired, setSessionExpired] = useState(false)
    const [wasLoggedIn, setWasLoggedIn] = useState(false)
    const router = useRouter()

    // Helper to refresh session cookie with new Firebase ID token
    const refreshSessionCookie = useCallback(async () => {
        try {
            const fbUser = firebaseAuth.currentUser

            if (fbUser) {
                let token = idToken
                let shouldRefresh = true

                if (token) {
                    const expiry = getTokenExpiry(token)

                    if (expiry && expiry - Date.now() > 5 * 60 * 1000) {
                        // Token is valid for more than 5 minutes, no need to refresh
                        shouldRefresh = false
                    }
                }
                if (shouldRefresh) {
                    token = await fbUser.getIdToken(true)
                    setIdToken(token)
                    await startSession(token)
                }
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                logWarning('Error refreshing session cookie:', err)
            }
        }
    }, [idToken])

    useEffect(() => {
        ;(async () => {
            try {
                const { user } = await userSession()

                if (!user) {
                    // Don't set sessionExpired if we're on a NotFound page
                    const isNotFoundPage =
                        window.location.pathname.includes('/@') && !document.querySelector('main')

                    if (!isNotFoundPage && wasLoggedIn) {
                        setSessionExpired(true)
                    }
                    setUser(null)
                    setLoading(false)
                    setIdToken(null)
                } else {
                    setUser(user)
                    setLoading(false)
                    setSessionExpired(false)
                    setWasLoggedIn(true)
                    // Try to get Firebase ID token if logged in
                    try {
                        const fbUser = firebaseAuth.currentUser

                        if (fbUser) {
                            const token = await fbUser.getIdToken()

                            setIdToken(token)
                        } else {
                            setIdToken(null)
                        }
                    } catch (err) {
                        setIdToken(null)
                        if (process.env.NODE_ENV === 'development') {
                            logWarning('Error getting Firebase ID token:', err)
                        }
                    }
                }
            } catch (err) {
                // Handle any other unexpected errors
                setUser(null)
                setLoading(false)
                setIdToken(null)
                if (process.env.NODE_ENV === 'development') {
                    logWarning('Error in userSession:', err)
                }
            }
        })()
    }, [wasLoggedIn])

    useEffect(() => {
        if (sessionExpired && wasLoggedIn) {
            addToast({
                title: 'Session Expired',
                description: 'Your session has expired. Please log in again.',
                color: 'warning',
            })
        }
    }, [sessionExpired, wasLoggedIn])

    // Automatically refresh token a few minutes before expiry (even if user never switches tabs)
    useEffect(() => {
        if (!idToken) return
        const expiry = getTokenExpiry(idToken)

        if (!expiry) return
        const now = Date.now()
        // Refresh 5 minutes before expiry
        const msUntilRefresh = expiry - now - 5 * 60 * 1000

        if (msUntilRefresh > 0) {
            const timeout = setTimeout(() => {
                refreshSessionCookie()
            }, msUntilRefresh)

            return () => clearTimeout(timeout)
        }
    }, [idToken, refreshSessionCookie])

    const signOut = async () => {
        await serverSignOut()
        setUser(null)
        setIdToken(null)
        setSessionExpired(false)
        router.push('/')
    }

    return (
        <UserContext.Provider value={{ user, loading, signOut }}>{children}</UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)

    if (!context) throw new Error('useUser must be used within a UserProvider')

    return context
}
