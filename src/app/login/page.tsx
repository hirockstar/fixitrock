import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '®supabase/client'
import { adminAuth } from '®lib/firebaseAdmin'
import SignupModal from '®app/@modal/ui/modal'

export default async function SignupPage() {
    // Verify Firebase session cookie
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value || ''

    let firebaseUser: { phone_number?: string } | null = null

    try {
        if (sessionCookie) {
            firebaseUser = await adminAuth.verifySessionCookie(sessionCookie, true)
        }
    } catch {
        firebaseUser = null
    }

    // If logged in, check if user exists by phone
    if (firebaseUser?.phone_number) {
        const supabase = createClient()
        const normalizePhone = (p?: string | null) => (p ? p.replace(/[^0-9]/g, '') : '')
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('number', normalizePhone(firebaseUser.phone_number))
            .single()

        if (user && normalizePhone(firebaseUser.phone_number) === normalizePhone(user.number)) {
            redirect(`/@${user.username}`)
        }
    }

    return (
        <main className='flex min-h-screen items-center justify-center p-4'>
            <SignupModal />
        </main>
    )
}
