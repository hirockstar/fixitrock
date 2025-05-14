'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'

import { auth } from '®lib/firebase'

type AuthContextType = {
    isAuthenticated: boolean
    loading: boolean
    user: {
        username: string
        number: string
        phone: string
    } | null
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: true,
    user: null,
})

type AuthProviderProps = {
    children: React.ReactNode
    initialUser: AuthContextType['user']
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
    const [user, setUser] = useState(initialUser)
    const [loading, setLoading] = useState(!initialUser)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser?.phoneNumber) {
                // optionally re-fetch from Supabase if you want to
                setUser({ username: '', number: '', phone: firebaseUser.phoneNumber })
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
