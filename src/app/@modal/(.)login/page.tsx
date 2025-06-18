import { redirect } from 'next/navigation'

import { userSession } from '®actions/auth'
import { LoginModal } from '®app/login/ui/modal'

export default async function LoginModalPage() {
    const user = await userSession()

    if (user) {
        redirect(`/`)
    }

    return <LoginModal />
}
