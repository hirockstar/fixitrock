'use client'

import { redirect } from 'next/navigation'

import { useAuth } from '®provider/auth'

import { LoginModal } from './ui/modal'

export default function LoginPage() {
    const { user, loading } = useAuth()

    if (loading) return
    if (user) {
        redirect(`/`)
    }

    return <LoginModal />
}
