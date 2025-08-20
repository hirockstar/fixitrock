'use server'

import { createClient } from '@/supabase/server'
import { withErrorHandling } from '@/lib/utils'

const TOKEN_EXPIRY_TIME = 60 * 60 * 1000 // 1 hour in milliseconds

export const getToken = withErrorHandling(async (): Promise<string> => {
    const supabase = await createClient()

    // Get current access token from row ID 1
    const { data: tokenRecord } = await supabase
        .from('space_tokens')
        .select('access_token, token_expires_at')
        .eq('id', 1)
        .single()

    const currentTimeUTC = new Date().toISOString()

    // Check if we have a valid token
    if (tokenRecord && tokenRecord.access_token && tokenRecord.token_expires_at > currentTimeUTC) {
        return tokenRecord.access_token
    }

    // Get credentials from space_credentials table
    const { data: credentials } = await supabase
        .from('space_credentials')
        .select('id, client_id, client_secret, refresh_token')
        .limit(1)
        .single()

    if (!credentials) {
        throw new Error(
            'Space credentials not found. Please add your Microsoft Azure credentials first.'
        )
    }

    if (!credentials.refresh_token) {
        throw new Error('No refresh token available. Please complete the OAuth setup first.')
    }

    // Exchange refresh token for new access token
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

        if (errorDetails.includes('AADSTS700082')) {
            throw new Error(
                'Refresh token has expired due to inactivity. Please generate a new one.'
            )
        }

        throw new Error(`Token request failed: ${errorDetails}`)
    }

    const { access_token, expires_in } = await tokenResponse.json()

    if (!access_token) {
        throw new Error('No access token received from Microsoft')
    }

    // Calculate expiry time
    const expires_at = new Date(Date.now() + (expires_in || TOKEN_EXPIRY_TIME)).toISOString()

    // Always use row ID 1 - update if exists, insert if not
    if (tokenRecord) {
        // Update existing token record at ID 1
        await supabase
            .from('space_tokens')
            .update({
                access_token: access_token,
                token_expires_at: expires_at,
            })
            .eq('id', 1)
    } else {
        // Insert new token record with ID 1
        await supabase.from('space_tokens').upsert({
            id: 1,
            credential_id: credentials.id,
            access_token: access_token,
            token_expires_at: expires_at,
        })
    }

    // Prove refresh token is active by using the access token
    try {
        await fetch('https://graph.microsoft.com/v1.0/me/drive', {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        })
    } catch {
        // Continue even if test fails
    }

    return access_token
})
