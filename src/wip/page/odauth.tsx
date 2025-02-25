'use client'

import { Button, Input } from '@heroui/react'
import { useState } from 'react'

export default function AuthPage() {
    const [clientId, setClientId] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const [redirectUri, setRedirectUri] = useState('')
    const [scope, setScope] = useState('user.read files.read.all offline_access')

    const openAuthUrl = () => {
        if (!clientId || !redirectUri) {
            alert('Please enter Client ID and Redirect URI.')

            return
        }

        const authUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize')

        authUrl.searchParams.append('client_id', clientId)
        authUrl.searchParams.append('response_type', 'code')
        authUrl.searchParams.append('redirect_uri', redirectUri)
        authUrl.searchParams.append('scope', scope)
        authUrl.searchParams.append('response_mode', 'query')

        window.open(authUrl.toString(), '_blank')
    }

    return (
        <div className='flex min-h-screen flex-col items-center justify-center space-y-6'>
            <h1 className='text-2xl font-bold'>OneDrive OAuth Authorization</h1>

            {/* Client ID */}
            <div className='flex w-96 flex-col'>
                <label className='mb-1 text-sm font-medium'>Client ID</label>
                <Input
                    placeholder='Enter your Client ID'
                    type='text'
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                />
            </div>

            {/* Client Secret */}
            <div className='flex w-96 flex-col'>
                <label className='mb-1 text-sm font-medium'>Client Secret</label>
                <Input
                    placeholder='Enter your Client Secret'
                    type='password'
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                />
            </div>

            {/* Redirect URI */}
            <div className='flex w-96 flex-col'>
                <label className='mb-1 text-sm font-medium'>Redirect URI</label>
                <Input
                    placeholder='Enter your Redirect URI'
                    type='text'
                    value={redirectUri}
                    onChange={(e) => setRedirectUri(e.target.value)}
                />
            </div>

            {/* Scope */}
            <div className='flex w-96 flex-col'>
                <label className='mb-1 text-sm font-medium'>Scope</label>
                <Input
                    placeholder='Scopes for API access'
                    radius='sm'
                    type='text'
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                />
                <p className='mt-1 text-xs text-gray-500'>
                    Default: <code>user.read files.read.all offline_access</code>
                </p>
            </div>

            {/* Open Auth URL Button */}
            <Button
                className='bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
                radius='full'
                onPress={openAuthUrl}
            >
                Get Authorization Code
            </Button>
        </div>
    )
}
