'use client'

import { redirect } from 'next/navigation'

import { LoginModal } from '®app/login/ui/modal'
import { useAuth } from '®provider/auth'

export default function Modal() {
    const { user, loading } = useAuth()

    if (loading) return
    if (user) {
        redirect(`/`)
    }

    return <LoginModal />
}
