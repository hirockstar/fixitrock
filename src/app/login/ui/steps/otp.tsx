'use client'

import type { ConfirmationResult } from 'firebase/auth'

import { useEffect, useState } from 'react'
import { Button, Form } from '@heroui/react'
import { InputOtp } from '@heroui/input-otp'
import { Dispatch, SetStateAction } from 'react'
import { Timer } from 'lucide-react'

import { verifyAndSaveUser } from '®actions/auth'
import { LoginStep } from '®app/login/types'
import { DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '®ui/drawer'

interface StepOtpProps {
    otp: string
    setOtp: (val: string) => void
    setStep: Dispatch<SetStateAction<LoginStep>>
    loading: boolean
    setLoading: (val: boolean) => void
    setError: (val: string) => void
    confirmationResult: ConfirmationResult
    resendOtp: () => void
    phone: string
}

const OTP_LENGTH = 6
const RESEND_TIMEOUT = 60 // in seconds

export function StepOtp({
    otp,
    setOtp,
    setStep,
    loading,
    setLoading,
    setError,
    confirmationResult,
    resendOtp,
    phone,
}: StepOtpProps) {
    const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT)

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (otp.length === OTP_LENGTH && !loading) {
            handleVerifyOtp()
        }
    }, [otp])

    const handleVerifyOtp = async () => {
        setError('')
        setLoading(true)
        try {
            const result = await confirmationResult.confirm(otp)
            const token = await result.user.getIdToken(true)

            document.cookie = `firebase_id_token=${token}; path=/`

            const res = await verifyAndSaveUser(token)

            if (res?.error) throw new Error(res.error)

            if (res?.isNew) {
                setStep('details')
            } else {
                window.location.href = '/'
            }
        } catch {
            setError('Invalid OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }
    const formatTime = (secs: number) => {
        const m = String(Math.floor(secs / 60)).padStart(2, '0')
        const s = String(secs % 60).padStart(2, '0')

        return `${m}:${s}`
    }

    const handleResend = () => {
        if (secondsLeft === 0) {
            resendOtp()
            setSecondsLeft(RESEND_TIMEOUT)
        }
    }

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault()
                handleVerifyOtp()
            }}
        >
            <DrawerHeader className='w-full py-2'>
                <DrawerTitle className='text-xl font-semibold'>Enter Verification Code</DrawerTitle>
                <DrawerDescription className='text-accent-foreground text-sm'>
                    Enter the verification code sent to <br />
                    <strong>+91 {phone}</strong>{' '}
                    <button
                        className='text-danger ml-1 font-medium hover:underline'
                        type='button'
                        onClick={() => setStep('phone')}
                    >
                        Wrong number?
                    </button>
                </DrawerDescription>
            </DrawerHeader>

            <InputOtp
                autoSave=''
                className='mx-auto flex w-full items-center justify-center gap-5'
                classNames={{
                    segmentWrapper: 'gap-x-4',
                }}
                length={OTP_LENGTH}
                value={otp}
                variant='underlined'
                onValueChange={setOtp}
            />

            <DrawerFooter className='flex w-full flex-col items-center space-y-2'>
                <Button
                    fullWidth
                    color={loading ? 'primary' : otp.length < OTP_LENGTH ? 'default' : 'primary'}
                    isDisabled={otp.length < OTP_LENGTH}
                    isLoading={loading}
                    type='submit'
                >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                {secondsLeft > 0 && (
                    <p className='text-muted-foreground flex items-center gap-1 text-sm'>
                        <Timer size={18} />
                        <span className='tabular-nums'>{formatTime(secondsLeft)}</span>
                    </p>
                )}

                <div className='text-muted-foreground flex items-center gap-1 text-center text-xs'>
                    <p>Didn’t receive the OTP?</p>
                    <button
                        className={`font-medium ${
                            secondsLeft > 0
                                ? 'text-muted-foreground cursor-not-allowed'
                                : 'text-primary hover:underline'
                        }`}
                        disabled={secondsLeft > 0}
                        type='button'
                        onClick={handleResend}
                    >
                        Resend OTP
                    </button>
                </div>
            </DrawerFooter>
        </Form>
    )
}
