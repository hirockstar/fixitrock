import { redirect } from 'next/navigation'

import { getAuth } from '®lib/auth'

import SignupModal from '../ui/modal'

export default async function Modal() {
    const auth = await getAuth()

    if (auth.status === 'authenticated') {
        redirect(`/@${auth.user.username}`)
    }

    return <SignupModal />
}
