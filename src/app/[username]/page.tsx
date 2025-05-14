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

    return (
        <div className='mx-auto max-w-lg p-8'>
            <h1 className='mb-2 text-2xl font-bold'>@{user?.username || username}</h1>
            {user ? (
                <>
                    <div>First Name: {user.first_name}</div>
                    <div>Last Name: {user.last_name}</div>
                    <div>Phone: {user.number}</div>
                    <div>Date of Birth: {user.dob}</div>
                    <div>Role: {user.role}</div>
                    <div>Joined: {new Date(user.created_at).toLocaleDateString()}</div>
                </>
            ) : (
                <div className='text-red-500'>User not found.</div>
            )}
            {firebaseUser &&
                user &&
                normalizePhone(firebaseUser.phone_number) === normalizePhone(user.number) && (
                    <form action='/api/logout' className='mt-8' method='POST'>
                        <button
                            className='rounded bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600'
                            type='submit'
                        >
                            Log out
                        </button>
                    </form>
                )}
        </div>
    )
}
