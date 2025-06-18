'use client'

import { useState } from 'react'
import { ConfirmationResult } from 'firebase/auth'
import { usePathname, useRouter } from 'next/navigation'

import { LoginStep } from '../types'

import { StepDetails, StepOtp, StepPhone } from './steps'

import { User } from '®app/login/types'
import { useMediaQuery } from '®hooks/useMediaQuery'
import { Drawer, DrawerContent } from '®ui/drawer'
import { Dialog, DialogContent } from '®ui/dialog'

export function LoginModal() {
    const router = useRouter()
    const pathname = usePathname()

    const isDesktop = useMediaQuery('(min-width: 640px)')
    const isOpen = pathname === '/login'
    const setIsOpen = () => {
        router.push('/')
    }

    return isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='sm:max-w-md'>
                <Steps />
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent
                className=''
                onInteractOutside={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                <Steps />
            </DrawerContent>
        </Drawer>
    )
}

function Steps() {
    const [step, setStep] = useState<LoginStep>('phone')

    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [user, setUserState] = useState<Partial<User>>({})

    const setUser = (val: Partial<User>) => {
        setUserState((prev) => ({ ...prev, ...val }))
    }

    const resendOtp = async () => {
        setError('')
        setLoading(true)
        try {
            const { signInWithPhoneNumber } = await import('firebase/auth')
            const { firebaseAuth } = await import('®firebase/client')
            const result = await signInWithPhoneNumber(
                firebaseAuth,
                '+91' + phone,
                window.recaptchaVerifier
            )

            setConfirmationResult(result)
        } catch {
            setError('Failed to resend OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {step === 'phone' && (
                <StepPhone
                    loading={loading}
                    phone={phone}
                    setConfirmationResult={setConfirmationResult}
                    setError={setError}
                    setLoading={setLoading}
                    setPhone={setPhone}
                    setStep={setStep}
                />
            )}

            {step === 'otp' && confirmationResult && (
                <StepOtp
                    confirmationResult={confirmationResult}
                    loading={loading}
                    otp={otp}
                    phone={phone}
                    resendOtp={resendOtp}
                    setError={setError}
                    setLoading={setLoading}
                    setOtp={setOtp}
                    setStep={setStep}
                />
            )}

            {step === 'details' && (
                <StepDetails
                    loading={loading}
                    setError={setError}
                    setLoading={setLoading}
                    setUser={setUser}
                    user={user}
                />
            )}

            {error && <p className='text-center text-sm text-red-500'>{error}</p>}
        </>
    )
}
