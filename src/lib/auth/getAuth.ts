'use server'

import { cookies } from 'next/headers'

import { createClient } from '®supabase/client'
import { adminAuth } from '®lib/firebaseAdmin'

type AuthResult =
    | {
          status: 'authenticated'
          user: {
              username: string
              number: string
              phone: string
          }
      }
    | {
          status: 'unauthenticated'
      }

export async function getAuth(): Promise<AuthResult> {
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

    if (!firebaseUser?.phone_number) {
        return { status: 'unauthenticated' }
    }

    const normalizePhone = (p?: string | null) => (p ? p.replace(/[^0-9]/g, '') : '')
    const supabase = createClient()

    const { data: user } = await supabase
        .from('users')
        .select('username, number')
        .eq('number', normalizePhone(firebaseUser.phone_number))
        .single()

    if (user && normalizePhone(firebaseUser.phone_number) === normalizePhone(user.number)) {
        return {
            status: 'authenticated',
            user: {
                username: user.username,
                number: user.number,
                phone: normalizePhone(firebaseUser.phone_number),
            },
        }
    }

    return { status: 'unauthenticated' }
}
