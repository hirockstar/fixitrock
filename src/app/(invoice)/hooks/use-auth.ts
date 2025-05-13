'use client'

import { useEffect, useState } from 'react'

export function usePasswordGate(storageKey: string, correctPassword: string) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem(storageKey)

        if (stored === correctPassword) {
            setIsLoggedIn(true)
        }
    }, [storageKey, correctPassword])

    const login = (password: string) => {
        const isValid = password === correctPassword

        if (isValid) {
            localStorage.setItem(storageKey, password)
            setIsLoggedIn(true)
        }

        return isValid
    }

    const logout = () => {
        localStorage.removeItem(storageKey)
        setIsLoggedIn(false)
    }

    return { isLoggedIn, login, logout }
}
