import type { User } from 'firebase/auth'

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { sendOtp, verifyOtp } from '®services/otp'
import { createClient } from '®supabase/client'
import { auth as firebaseAuth } from '®lib/firebase'
import { logWarning } from '®lib/utils'

// Helper to create server-side session cookie
async function setSessionCookie(providedUser?: User, target?: string) {
    try {
        let user = providedUser || firebaseAuth.currentUser
        let retries = 0

        while (!user && retries < 10) {
            await new Promise((r) => setTimeout(r, 100)) // 100 ms
            user = firebaseAuth.currentUser
            retries += 1
        }

        if (!user) {
            return
        }

        const idToken = await user.getIdToken(true)

        if (!target) {
            throw new Error('No target provided for session cookie redirect')
        }

        // Create a hidden iframe
        let iframe = document.getElementById('session-iframe') as HTMLIFrameElement | null

        if (!iframe) {
            iframe = document.createElement('iframe')
            iframe.style.display = 'none'
            iframe.id = 'session-iframe'
            iframe.name = 'session-iframe'
            document.body.appendChild(iframe)
        }

        // Create a form targeting the iframe
        const form = document.createElement('form')

        form.method = 'POST'
        form.action = '/api/sessionLogin'
        form.target = 'session-iframe'
        form.style.display = 'none'

        const idTokenInput = document.createElement('input')

        idTokenInput.type = 'hidden'
        idTokenInput.name = 'idToken'
        idTokenInput.value = idToken
        form.appendChild(idTokenInput)

        const targetInput = document.createElement('input')

        targetInput.type = 'hidden'
        targetInput.name = 'target'
        targetInput.value = target
        form.appendChild(targetInput)

        document.body.appendChild(form)

        // Listen for iframe load to redirect main window
        iframe.onload = () => {
            window.location.replace(target!)
        }

        form.submit()
    } catch (err) {
        logWarning('[OTP] setSessionCookie error', err)
    }
}

export function useAuthOtp(onSuccess?: () => void) {
    const [step, setStep] = useState<'phone' | 'otp' | 'details'>('phone')
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState(Array(6).fill(''))
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [dob, setDob] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isNewUser, setIsNewUser] = useState(false)
    const [redirecting, setRedirecting] = useState(false)
    const toastIdRef = useRef<string | number | null>(null)

    const handleSendOtp = async () => {
        setLoading(true)
        setError('')
        try {
            await sendOtp(phone)
            setStep('otp')
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Failed to send OTP')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        setLoading(true)
        setError('')
        try {
            const code = otp.join('')
            const cred = await verifyOtp(code)

            if (!cred.user) throw new Error('OTP verification failed: no user returned')

            const supabase = createClient()
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('username')
                .eq('number', phone)
                .single()

            if (userError) {
                if (userError.message?.includes('multiple (or no) rows returned')) {
                    setIsNewUser(true)
                    setStep('details')

                    return
                }
                if (userError.code === '42501' || userError.message?.includes('permission')) {
                    throw new Error('Permission denied while accessing profile. Check RLS.')
                }
                throw new Error(userError.message || 'Database error while fetching profile')
            }

            if (user?.username) {
                const target = '/@' + user.username

                toastIdRef.current = toast('Redirecting to your profile…', { duration: Infinity })
                await setSessionCookie(cred.user, target)
                if (onSuccess) onSuccess()
            } else {
                setIsNewUser(true)
                setStep('details')
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Invalid code or user lookup failed')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitDetails = async () => {
        setLoading(true)
        setError('')
        try {
            const supabase = createClient()
            const { error: dbError, data } = await supabase
                .from('users')
                .insert({
                    first_name: firstName,
                    last_name: lastName,
                    username,
                    number: phone,
                    dob,
                    created_at: new Date().toISOString(),
                    role: 'subscriber',
                })
                .select('username')
                .single()

            if (dbError || !data?.username) throw dbError || new Error('Signup failed')

            const target = '/@' + data.username

            toastIdRef.current = toast('Redirecting to your profile…', { duration: Infinity })
            setRedirecting(true)
            await setSessionCookie(undefined, target)
            if (onSuccess) onSuccess()
        } catch (err: unknown) {
            setError(formatSupabaseError(err))
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setStep('phone')
        setPhone('')
        setOtp(Array(6).fill(''))
        setFirstName('')
        setLastName('')
        setUsername('')
        setDob('')
        setLoading(false)
        setError('')
        setIsNewUser(false)
    }

    // Dismiss the toast when the URL changes
    useEffect(() => {
        const handleUrlChange = () => {
            if (toastIdRef.current) {
                toast.dismiss(toastIdRef.current)
                toastIdRef.current = null
            }
        }

        window.addEventListener('popstate', handleUrlChange)
        window.addEventListener('pushstate', handleUrlChange)
        window.addEventListener('replaceState', handleUrlChange)
        window.addEventListener('hashchange', handleUrlChange)

        return () => {
            window.removeEventListener('popstate', handleUrlChange)
            window.removeEventListener('pushstate', handleUrlChange)
            window.removeEventListener('replaceState', handleUrlChange)
            window.removeEventListener('hashchange', handleUrlChange)
        }
    }, [])

    return {
        step,
        setStep,
        phone,
        setPhone,
        otp,
        setOtp,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        username,
        setUsername,
        dob,
        setDob,
        loading,
        error,
        setError,
        handleSendOtp,
        handleVerifyOtp,
        handleSubmitDetails,
        isNewUser,
        reset,
        redirecting,
    }
}

function formatSupabaseError(err: unknown): string {
    if (!err) return 'Unknown error'

    if (typeof err === 'string') return err
    if (err instanceof Error) return err.message

    if (typeof err === 'object' && err !== null) {
        if ('message' in err && typeof err.message === 'string') return err.message
        if ('error_description' in err && typeof err.error_description === 'string')
            return err.error_description
        if ('error' in err && typeof err.error === 'string') return err.error
    }

    return JSON.stringify(err)
}
