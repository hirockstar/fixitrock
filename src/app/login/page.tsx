import { redirect } from 'next/navigation'

import SignupModal from '®app/@modal/ui/modal'
import { getAuth } from '®lib/auth'

export default async function SignupPage() {
    const auth = await getAuth()

    if (auth.status === 'authenticated') {
        redirect(`/@${auth.user.username}`)
    }

    return <SignupModal />
}
