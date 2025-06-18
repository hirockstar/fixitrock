import { redirect } from 'next/navigation'

import { LoginModal } from './ui/modal'

import { userSession } from '®actions/auth'

export default async function LoginPage() {
    const user = await userSession()

    if (user) {
        redirect(`/`)
    }

    return <LoginModal />
}
