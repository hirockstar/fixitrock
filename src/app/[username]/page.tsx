import { cookies } from 'next/headers'

import { createClient } from '®supabase/client'
import { adminAuth } from '®lib/firebaseAdmin'

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ username?: string }>
}) {
    const { username: rawUsername } = await params

    const decoded = rawUsername ? decodeURIComponent(rawUsername) : ''

    const username = decoded.startsWith('@') ? decoded.slice(1) : decoded

    const supabase = createClient()

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

    // Fetch the profile by username
    const { data: user } = await supabase
        .from('users')
        .select('*')
        .ilike('username', username)
        .single()

    const normalizePhone = (p?: string | null) => (p ? p.replace(/[^0-9]/g, '') : '')

    if (firebaseUser && user) {
    }

    // Protect: Only allow the logged-in user to view their own profile
    if (
        !firebaseUser ||
        !user ||
        normalizePhone(firebaseUser.phone_number) !== normalizePhone(user.number)
    ) {
        // Redirect unauthorized users to signup
        if (typeof window !== 'undefined') {
            window.location.replace('/login')

            return null
        }

        // SSR fallback: meta refresh
        return (
            <html>
                <head>
                    <meta content='0;url=/login' httpEquiv='refresh' />
                </head>
                <body>
                    <div className='p-8 text-center text-red-500'>Redirecting to signup…</div>
                </body>
            </html>
        )
    }

    return (
        <div className='mx-auto max-w-lg p-8'>
            <h1 className='mb-2 text-2xl font-bold'>@{user.username}</h1>
            <div>First Name: {user.first_name}</div>
            <div>Last Name: {user.last_name}</div>
            <div>Phone: {user.number}</div>
            <div>Date of Birth: {user.dob}</div>
            <div>Role: {user.role}</div>
            <div>Joined: {new Date(user.created_at).toLocaleDateString()}</div>
            <form action='/api/logout' className='mt-8' method='POST'>
                <button
                    className='rounded bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600'
                    type='submit'
                >
                    Log out
                </button>
            </form>
        </div>
    )
}
