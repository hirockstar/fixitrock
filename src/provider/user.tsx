'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'

import { userSession, signOut as serverSignOut, navLinks as fetchNavLinks } from '®actions/auth'
import { User, NavLink } from '®app/login/types'
import { createClient } from '®supabase/client'
import { getAuth } from 'firebase/auth'

interface UserContextType {
    user: User | null
    loading: boolean
    signOut: () => Promise<void>
    navLinks: NavLink[]
    getSupabaseClientWithAuth: () => Promise<ReturnType<typeof createClient>>
    idToken: string | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [navLinks, setNavLinks] = useState<NavLink[]>([])
    const [idToken, setIdToken] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        ;(async () => {
            const sessionUser = await userSession()
            setUser(sessionUser)
            setLoading(false)
            // Try to get Firebase ID token if logged in
            try {
                const auth = getAuth()
                const fbUser = auth.currentUser
                if (fbUser) {
                    const token = await fbUser.getIdToken()
                    setIdToken(token)
                } else {
                    setIdToken(null)
                }
            } catch {
                setIdToken(null)
            }
        })()
    }, [])

    // Fetch nav links when user or user.role changes
    useEffect(() => {
        if (!user) {
            setNavLinks([])
            return
        }
        const role = typeof user.role === 'number' ? user.role : 1
        fetchNavLinks(role.toString()).then(setNavLinks)
    }, [user, user?.role])

    // Listen for sign-out events from other tabs
    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key === 'signout') {
                setUser(null)
                setNavLinks([])
                setIdToken(null)
                router.push('/')
            }
        }

        window.addEventListener('storage', onStorage)

        return () => window.removeEventListener('storage', onStorage)
    }, [router])

    const signOut = async () => {
        await serverSignOut()
        window.localStorage.setItem('signout', Date.now().toString())
        setUser(null)
        setNavLinks([])
        setIdToken(null)
        router.push('/')
    }

    // Helper to get a Supabase client with the current user's Firebase ID token
    const getSupabaseClientWithAuth = useCallback(async () => {
        let token = idToken
        try {
            const auth = getAuth()
            const fbUser = auth.currentUser
            if (fbUser) {
                token = await fbUser.getIdToken()
            }
        } catch {}
        return createClient(token || undefined)
    }, [idToken])

    return (
        <UserContext.Provider value={{ user, loading, signOut, navLinks, getSupabaseClientWithAuth, idToken }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)

    if (!context) throw new Error('useUser must be used within a UserProvider')

    return context
}
