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
            logWarning('[OTP] setSessionCookie – currentUser still null after 1 s')

            return
        }

        const idToken = await user.getIdToken(true)

        if (!target) {
            throw new Error('No target provided for session cookie redirect')
        }

        // Use fetch to POST to /api/sessionLogin
        const res = await fetch('/api/sessionLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken, target }),
            credentials: 'include',
        })

        if (!res.ok) {
            const data = await res.json().catch(() => ({}))

            throw new Error(data.error || 'Failed to set session cookie')
        }

        // On success, navigate to the target page
        window.location.replace(target)
    } catch (err) {
        logWarning('[OTP] setSessionCookie error', err)
    }
}

export function useAuthOtp(onSuccess?: () => void) {
    const [step, setStep] = useState<'phone' | 'otp' | 'details'>('phone')
    const [phoneRaw, setPhoneRaw] = useState('') // Only the 10 digits
    const phone = '+91' + phoneRaw
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
    const [isUsernameUnique, setIsUsernameUnique] = useState<boolean | null>(null)
    const [checkingUsername, setCheckingUsername] = useState(false)
    const [usernameChecked, setUsernameChecked] = useState(false)
    const [otpTimer, setOtpTimer] = useState(60)
    const otpTimerRef = useRef<NodeJS.Timeout | null>(null)

    // Only allow Indian numbers
    const isIndian = true

    const validatePhone = () => {
        if (!/^\d{10}$/.test(phoneRaw)) {
            setError('Please enter a valid 10-digit Indian phone number')

            return false
        }
        setError('')

        return true
    }

    const setPhoneRawSafe = (value: string) => {
        setPhoneRaw(value.replace(/\D/g, '').slice(0, 10))
    }

    const handleSendOtp = async () => {
        if (!validatePhone()) return
        setLoading(true)
        setError('')
        try {
            await sendOtp(phone)
            setStep('otp')
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        setError('')
        const code = Array.isArray(otp) ? otp.join('') : otp

        if (!code || code.length !== 6) {
            setError('Please enter the 6-digit OTP code.')

            return
        }
        setLoading(true)
        try {
            const cred = await verifyOtp(code)

            if (!cred.user) {
                throw new Error('OTP verification failed: no user returned')
            }
            // Check if user exists by phone
            const supabase = createClient()
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('username')
                .eq('number', phone)
                .single()

            if (userError) {
                if (
                    userError.message &&
                    userError.message.includes('multiple (or no) rows returned')
                ) {
                    // No user found, proceed to signup
                    logWarning('[OTP] No user found for phone, proceeding to details step.')
                    setIsNewUser(true)
                    setStep('details')

                    return
                }
                /* eslint-disable no-console */
                console.error('Supabase lookup error:', userError)
                if (userError.code === '42501' || userError.message?.includes('permission')) {
                    throw new Error('Permission denied while accessing profile. Check RLS.')
                }
                throw new Error(userError.message || 'Database error while fetching profile')
            }

            if (user && user.username) {
                console.log('[OTP] Existing user found, username =', user.username)
                // Existing user: sign in
                const target = '/@' + user.username

                await setSessionCookie(cred.user, target)
                if (onSuccess) {
                    console.log('Calling onSuccess to close modal (existing user)')
                    onSuccess()
                }
            } else {
                logWarning('[OTP] User not found, proceeding to details step. Phone:', phone)
                setIsNewUser(true)
                setStep('details')
            }
        } catch (err: unknown) {
            // Show a generic message only for Firebase OTP errors
            if (
                err &&
                typeof err === 'object' &&
                'code' in err &&
                (err as Record<string, unknown>).code === 'auth/invalid-verification-code'
            ) {
                setError('Invalid OTP code. Please try again or resend OTP.')
            } else if (err instanceof Error && err.message) {
                setError(err.message)
            } else {
                setError('An unexpected error occurred. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const DEFAULT_ROLE_UUID = '13cc2a2d-69d9-48cd-8660-15d0f6e0c298'

    const handleSubmitDetails = async () => {
        setLoading(true)
        setError('')
        // Validate required fields
        if (!firstName.trim() || !lastName.trim() || !username.trim() || !dob.trim()) {
            setError('All fields are required.')
            setLoading(false)

            return
        }
        try {
            const supabase = createClient()
            // Check if username already exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('username', username)
                .single()

            if (existingUser) {
                setError('This username is already taken. Please choose another.')
                setLoading(false)

                return
            }
            // Insert new user profile
            const { error: dbError, data } = await supabase
                .from('users')
                .insert({
                    first_name: firstName,
                    last_name: lastName,
                    username,
                    number: phone,
                    dob,
                    created_at: new Date().toISOString(),
                    role: DEFAULT_ROLE_UUID,
                })
                .select('username')
                .single()

            if (dbError || !data?.username) throw dbError || new Error('Signup failed')
            const target = '/@' + data.username

            setRedirecting(true)
            if (onSuccess) {
                console.log('Calling onSuccess to close modal (new user)')
                onSuccess()
            }
        } catch (err: unknown) {
            setError(formatSupabaseError(err))
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setStep('phone')
        setPhoneRaw('')
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

    // Debounced username check
    useEffect(() => {
        if (!username) {
            setIsUsernameUnique(null)
            setUsernameChecked(false)

            return
        }
        setCheckingUsername(true)
        const timeout = setTimeout(async () => {
            const supabase = createClient()
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('username', username)
                .single()

            setIsUsernameUnique(!existingUser)
            setUsernameChecked(true)
            setCheckingUsername(false)
        }, 500)

        return () => clearTimeout(timeout)
    }, [username])

    const startOtpTimer = () => {
        setOtpTimer(60)
        if (otpTimerRef.current) clearInterval(otpTimerRef.current)
        otpTimerRef.current = setInterval(() => {
            setOtpTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(otpTimerRef.current!)

                    return 0
                }

                return prev - 1
            })
        }, 1000)
    }

    useEffect(() => {
        if (step === 'otp') {
            startOtpTimer()
        } else {
            setOtpTimer(60)
            if (otpTimerRef.current) clearInterval(otpTimerRef.current)
        }

        return () => {
            if (otpTimerRef.current) clearInterval(otpTimerRef.current)
        }
    }, [step])

    const resendOtp = async () => {
        await handleSendOtp()
        startOtpTimer()
    }

    return {
        step,
        setStep,
        phone,
        phoneRaw,
        setPhoneRaw: setPhoneRawSafe,
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
        isIndian,
        isUsernameUnique,
        checkingUsername,
        usernameChecked,
        otpTimer,
        resendOtp,
    }
}

function formatSupabaseError(err: unknown): string {
    if (!err) return 'Unknown error'
    if (typeof err === 'string') return err
    if (err instanceof Error && err.message) return err.message
    if (typeof err === 'object' && err !== null) {
        if (
            'error_description' in err &&
            typeof (err as { error_description?: string }).error_description === 'string'
        ) {
            return (err as { error_description: string }).error_description
        }
        if ('error' in err && typeof (err as { error?: string }).error === 'string') {
            return (err as { error: string }).error
        }
    }

    return JSON.stringify(err)
}
