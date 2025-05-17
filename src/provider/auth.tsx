'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onIdTokenChanged, getIdToken } from 'firebase/auth'

import { firebaseAuth } from '®firebase/client'
import { revokeUserSession, verifyAndSaveUser } from '®actions/auth'

// Define your Supabase user type
type User = {
    id: string
    phone: string
    name: string
    username: string
    role: 'user' | 'admin' | 'shopkeeper'
    created_at: string
}

// Context shape
type AuthContextType = {
    user: User | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onIdTokenChanged(firebaseAuth, async (firebaseUser) => {
            if (firebaseUser) {
                const token = await getIdToken(firebaseUser, true)

                const res = await verifyAndSaveUser(token)

                if (res?.user) {
                    document.cookie = `firebase_id_token=${token}; path=/`
                    setUser(res.user)
                } else {
                    setUser(null)
                }
            } else {
                setUser(null)
                document.cookie =
                    'firebase_id_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            }

            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const signOut = async () => {
        await revokeUserSession()
        await firebaseAuth.signOut()
        setUser(null)

        window.location.href = '/'
    }

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}
