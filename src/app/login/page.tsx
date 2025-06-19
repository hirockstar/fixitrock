'use client'

import { redirect } from 'next/navigation'

import { LoginModal } from './ui/modal'

import { useUser } from '®provider/user'

export default  function LoginPage() {
  const { user } = useUser()
    if (user) {
        redirect(`/`)
    }

    return <LoginModal />
}
