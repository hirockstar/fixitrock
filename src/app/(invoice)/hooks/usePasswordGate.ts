'use client'

import { useEffect, useState } from 'react'

type Role = 'admin' | 'user' | null

interface UsePasswordGateProps {
    storageKey: string
    adminPassword: string
    userPassword?: string
}

export function usePasswordGate({ storageKey, adminPassword, userPassword }: UsePasswordGateProps) {
    const [role, setRole] = useState<Role>(null)

    useEffect(() => {
        const stored = localStorage.getItem(storageKey)

        // Check if the password matches either admin or user
        if (stored === adminPassword) {
            setRole('admin')
        } else if (userPassword && stored === userPassword) {
            setRole('user')
        }
    }, [storageKey, adminPassword, userPassword])

    const login = (password: string) => {
        let newRole: Role = null

        if (password === adminPassword) {
            newRole = 'admin'
        } else if (userPassword && password === userPassword) {
            newRole = 'user'
        }

        if (newRole) {
            localStorage.setItem(storageKey, password)
            setRole(newRole)

            return true
        }

        return false
    }

    const logout = () => {
        localStorage.removeItem(storageKey)
        setRole(null)
    }

    return {
        isLoggedIn: !!role,
        role,
        login,
        logout,
    }
}
