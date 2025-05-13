import { createClient } from '®supabase/client'
import { cookies } from 'next/headers'
import { adminAuth } from '®lib/firebaseAdmin'

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ username?: string }>
}) {
    const { username: rawUsername } = await params
    console.log('[SRV] Incoming username param =', rawUsername)
    const decoded = rawUsername ? decodeURIComponent(rawUsername) : ''

    const username = decoded.startsWith('@') ? decoded.slice(1) : decoded
    console.log('username', username)
    const supabase = createClient()

    // Verify Firebase session cookie
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value || ''
    console.log('[SRV] Cookie present =', cookieStore.get('session')?.value ? true : false)
    let firebaseUser: { phone_number?: string } | null = null
    try {
        if (sessionCookie) {
            firebaseUser = await adminAuth.verifySessionCookie(sessionCookie, true)
        }
    } catch {
        firebaseUser = null
    }

    // Fetch the profile by username
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .ilike('username', username)
        .single()

    const normalizePhone = (p?: string | null) => (p ? p.replace(/[^0-9]/g, '') : '')
    console.log('[SRV] Firebase user decoded =', firebaseUser)
    console.log('[SRV] Supabase row =', user, 'error=', error)
    if (firebaseUser && user) {
        console.log(
            '[SRV] Comparing phones',
            normalizePhone(firebaseUser.phone_number),
            normalizePhone(user.number)
        )
    }

    // Protect: Only allow the logged-in user to view their own profile
    if (
        !firebaseUser ||
        !user ||
        normalizePhone(firebaseUser.phone_number) !== normalizePhone(user.number)
    ) {
        console.warn('[SRV] Authorization failed. Reasons:', {
            hasFirebaseUser: !!firebaseUser,
            hasUserRow: !!user,
            phoneMatch:
                firebaseUser && user
                    ? normalizePhone(firebaseUser.phone_number) === normalizePhone(user.number)
                    : false,
        })
        // Redirect unauthorized users to signup
        if (typeof window !== 'undefined') {
            window.location.replace('/signup')
            return null
        }
        // SSR fallback: meta refresh
        return (
            <html>
                <head>
                    <meta httpEquiv='refresh' content='0;url=/signup' />
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
            <form method='POST' action='/api/logout' className='mt-8'>
                <button
                    type='submit'
                    className='rounded bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600'
                >
                    Log out
                </button>
            </form>
        </div>
    )
}
