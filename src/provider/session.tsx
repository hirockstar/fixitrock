'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

import { userSession, signOut as serverSignOut } from '®actions/auth'
import { User } from '®app/login/types'

interface SessionContextType {
    user: User | null
    loading: boolean
    signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        ;(async () => {
            const sessionUser = await userSession()

            setUser(sessionUser)
            setLoading(false)
        })()
    }, [])

    // Listen for sign-out events from other tabs
    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key === 'signout') {
                setUser(null)
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
        router.push('/')
    }

    return (
        <SessionContext.Provider value={{ user, loading, signOut }}>
            {children}
        </SessionContext.Provider>
    )
}

export function useSession() {
    const context = useContext(SessionContext)

    if (!context) throw new Error('useSession must be used within a SessionProvider')

    return context
}
