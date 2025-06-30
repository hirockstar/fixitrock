'use client'

import { redirect } from 'next/navigation'

import { useUser } from '®provider/user'

import { LoginModal } from './ui/modal'

export default function LoginPage() {
    const { user } = useUser()

    if (user) {
        redirect(`/`)
    }

    return <LoginModal />
}
