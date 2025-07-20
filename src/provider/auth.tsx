'use client'
import React, { createContext, useContext, useCallback, useEffect, ReactNode } from 'react'

import { logout as serverLogout } from '®actions/user'
interface AuthContextType {
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            const channel = new BroadcastChannel('auth')

            channel.onmessage = (event) => {
                if (event.data?.type === 'logout') {
                    window.location.reload()
                }
            }

            return () => channel.close()
        }
    }, [])

    const logout = useCallback(async () => {
        await serverLogout()
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            const channel = new BroadcastChannel('auth')

            channel.postMessage({ type: 'logout' })
            channel.close()
        }
        window.location.reload()
    }, [])

    return <AuthContext.Provider value={{ logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)

    if (!ctx) throw new Error('useAuth must be used within AuthProvider')

    return ctx
}
