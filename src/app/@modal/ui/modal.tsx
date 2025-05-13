'use client'

import { useRouter } from 'next/navigation'
import { Button, Input } from '@heroui/react'
import { useEffect, useRef, useState } from 'react'

import { Dialog, DialogContent } from '®ui/dialog'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '®ui/drawer'
import OTPInput from '®ui/otp-input'
import { useMediaQuery } from '®hooks/useMediaQuery'

import { useAuthOtp } from '../hooks/useAuthOtp'

function SignupStepContent({ onSignupSuccess }: { onSignupSuccess: () => void }) {
    const auth = useAuthOtp()
    const lastSubmittedOtp = useRef('')

    // Automatically verify OTP when 6 digits are entered, only once per unique OTP
    useEffect(() => {
        const otpValue = Array.isArray(auth.otp) ? auth.otp.join('') : auth.otp

        if (
            auth.step === 'otp' &&
            otpValue.length === 6 &&
            !auth.loading &&
            lastSubmittedOtp.current !== otpValue
        ) {
            lastSubmittedOtp.current = otpValue
            auth.handleVerifyOtp()
        }
    }, [auth.otp, auth.step, auth.loading])

    // Style the reCAPTCHA overlay when it appears
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const recaptchaOverlay = document.getElementById('rc-imageselect')

            if (recaptchaOverlay) {
                recaptchaOverlay.style.position = 'relative'
                recaptchaOverlay.style.zIndex = '200'
            }
        })

        observer.observe(document.body, { childList: true, subtree: true })

        return () => observer.disconnect()
    }, [])

    if (auth.step === 'phone') {
        return (
            <>
                <DrawerHeader>
                    <DrawerTitle className='text-xl font-semibold'>
                        Sign up or Sign in with your phone
                    </DrawerTitle>
                    <DrawerDescription className='mb-4 text-sm text-muted-foreground'>
                        Enter your phone number to receive an OTP
                    </DrawerDescription>
                    <Input
                        className='flex-1 border-0 bg-transparent p-0 text-base shadow-none focus:ring-0'
                        disabled={auth.loading}
                        label={undefined}
                        maxLength={10}
                        placeholder='9876543210'
                        size='lg'
                        startContent={<span className='text-sm text-muted-foreground'>+91</span>}
                        type='tel'
                        value={auth.phoneRaw}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10)

                            auth.setPhoneRaw(value)
                        }}
                    />
                    {auth.error && <p className='mt-2 text-sm text-red-500'>{auth.error}</p>}
                </DrawerHeader>
                <DrawerFooter>
                    <Button
                        className='w-full'
                        color='primary'
                        isLoading={auth.loading}
                        onPress={auth.handleSendOtp}
                    >
                        Send OTP
                    </Button>
                </DrawerFooter>
            </>
        )
    }

    if (auth.step === 'otp') {
        return (
            <>
                <DrawerHeader>
                    <DrawerTitle>Enter OTP</DrawerTitle>
                    <DrawerDescription>We sent a 6-digit code to {auth.phone}</DrawerDescription>
                    <div className='flex justify-center'>
                        <OTPInput
                            disabled={auth.loading || auth.otpTimer === 0}
                            length={6}
                            value={auth.otp}
                            onChange={auth.setOtp}
                        />
                    </div>
                    {auth.error && <p className='mt-2 text-sm text-red-500'>{auth.error}</p>}
                    {auth.otpTimer === 0 ? (
                        <div className='mt-2 text-sm text-red-500'>
                            OTP expired.{' '}
                            <button className='underline' onClick={auth.resendOtp}>
                                Resend OTP
                            </button>
                        </div>
                    ) : (
                        <div className='mt-2 text-sm text-gray-500'>
                            OTP valid for {auth.otpTimer} seconds
                        </div>
                    )}
                </DrawerHeader>
                <DrawerFooter>
                    <Button
                        className='w-full'
                        color='primary'
                        disabled={auth.loading || auth.otpTimer === 0}
                        isLoading={auth.loading}
                        onPress={auth.handleVerifyOtp}
                    >
                        Verify OTP
                    </Button>
                </DrawerFooter>
            </>
        )
    }

    if (auth.step === 'details') {
        return (
            <form
                className='space-y-4 px-4 pt-4'
                onSubmit={(e) => {
                    e.preventDefault()
                    auth.handleSubmitDetails()
                }}
            >
                <DrawerTitle>Complete your profile</DrawerTitle>
                <DrawerDescription>
                    Please enter your details to finish signing up.
                </DrawerDescription>
                <Input
                    required
                    disabled={auth.loading}
                    label='First Name'
                    value={auth.firstName}
                    onChange={(e) => auth.setFirstName(e.target.value)}
                />
                <Input
                    required
                    disabled={auth.loading}
                    label='Last Name'
                    value={auth.lastName}
                    onChange={(e) => auth.setLastName(e.target.value)}
                />
                <Input
                    required
                    disabled={auth.loading}
                    label='Username'
                    value={auth.username}
                    onChange={(e) => auth.setUsername(e.target.value)}
                />
                {auth.username && (
                    <div className='mt-1 min-h-[20px] text-sm'>
                        {auth.checkingUsername && (
                            <span className='text-gray-500'>Checking username...</span>
                        )}
                        {!auth.checkingUsername &&
                            auth.usernameChecked &&
                            auth.isUsernameUnique === true && (
                                <span className='text-green-600'>Username is available ✓</span>
                            )}
                        {!auth.checkingUsername &&
                            auth.usernameChecked &&
                            auth.isUsernameUnique === false && (
                                <span className='text-red-500'>
                                    This username is already taken.
                                </span>
                            )}
                    </div>
                )}
                <Input
                    required
                    disabled={auth.loading}
                    label='Date of Birth'
                    type='date'
                    value={auth.dob}
                    onChange={(e) => auth.setDob(e.target.value)}
                />
                {auth.error && <p className='text-sm text-red-500'>{auth.error}</p>}
                <DrawerFooter>
                    <Button
                        className='w-full'
                        color='primary'
                        disabled={
                            auth.loading ||
                            !auth.usernameChecked ||
                            !auth.isUsernameUnique ||
                            auth.checkingUsername
                        }
                        isLoading={auth.loading}
                        type='submit'
                    >
                        Finish Signup
                    </Button>
                </DrawerFooter>
            </form>
        )
    }

    return null
}

export default function SignupModal() {
    const router = useRouter()
    const isDesktop = useMediaQuery('(min-width: 640px)')
    const [recaptchaOpen, setRecaptchaOpen] = useState(false)
    const [open, setOpen] = useState(true)

    // Track reCAPTCHA overlay presence
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const recaptchaOverlay = document.getElementById('rc-imageselect')

            setRecaptchaOpen(!!recaptchaOverlay)
            if (recaptchaOverlay) {
                console.log('[reCAPTCHA] rc-imageselect appeared')
            } else {
                console.log('[reCAPTCHA] rc-imageselect not present')
            }
        })

        observer.observe(document.body, { childList: true, subtree: true })

        return () => observer.disconnect()
    }, [])

    const handleClose = () => {
        setOpen(false)
        setTimeout(() => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur()
            }
        }, 0)
        router.push('/')
    }

    // Only allow closing if reCAPTCHA is not open
    const handleOpenChange = (nextOpen: boolean) => {
        if (!recaptchaOpen && !nextOpen) handleClose()
    }

    // Handler to close modal on successful signup/profile redirect
    const handleSignupSuccess = () => {
        setOpen(false)
        setTimeout(() => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur()
            }
        }, 0)
        router.push('/')
    }

    return isDesktop ? (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className='max-w-md'>
                <SignupStepContent onSignupSuccess={handleSignupSuccess} />
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerContent>
                <SignupStepContent onSignupSuccess={handleSignupSuccess} />
            </DrawerContent>
        </Drawer>
    )
}
