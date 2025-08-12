'use server'

import { logWarning } from '@/lib/utils'
import { createClient } from '@/supabase/server'

const TOKEN_EXPIRY_TIME = 60 * 60 * 1000

export async function getToken() {
    const supabase = await createClient()

    try {
        const { data: tokenRecord } = await supabase
            .from('access_token')
            .select('id, token, expires_at')
            .limit(1)
            .single()

        const currentTimeUTC = new Date().toISOString()

        if (tokenRecord && tokenRecord.expires_at > currentTimeUTC) {
            return tokenRecord.token
        }

        const { data: credentials } = await supabase
            .from('api_credentials')
            .select('client_id, client_secret, refresh_token')
            .single()

        if (!credentials) {
            throw new Error('API credentials not found.')
        }

        const tokenResponse = await fetch(
            'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: credentials.client_id,
                    client_secret: credentials.client_secret,
                    grant_type: 'refresh_token',
                    refresh_token: credentials.refresh_token,
                }),
            }
        )

        if (!tokenResponse.ok) {
            const errorDetails = await tokenResponse.text()

            throw new Error(`Token request failed: ${errorDetails}`)
        }

        const { access_token } = await tokenResponse.json()

        const expires_at = new Date(Date.now() + TOKEN_EXPIRY_TIME).toISOString()

        if (tokenRecord) {
            await supabase
                .from('access_token')
                .update({ token: access_token, expires_at })
                .eq('id', tokenRecord.id)
        } else {
            await supabase.from('access_token').insert({ token: access_token, expires_at })
        }

        return access_token
    } catch (error) {
        logWarning('Error in getToken:', error)
        throw error
    }
}
