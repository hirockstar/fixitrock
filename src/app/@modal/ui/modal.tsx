'use client'

import { useRouter } from 'next/navigation'
import { Button, Input } from '@heroui/react'

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

function SignupStepContent() {
    const auth = useAuthOtp()

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
                        disabled={auth.loading}
                        label='Phone Number'
                        placeholder='+1 234 567 8901'
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
                            disabled={auth.loading}
                            length={6}
                            value={auth.otp}
                            onChange={auth.setOtp}
                        />
                    </div>
                    {auth.error && <p className='mt-2 text-sm text-red-500'>{auth.error}</p>}
                </DrawerHeader>
                <DrawerFooter>
                    <Button
                        className='w-full'
                        color='primary'
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

    const handleClose = () => {
        router.back()
    }

    return isDesktop ? (
        <Dialog open onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className='max-w-md'>
                <SignupStepContent />
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open onOpenChange={(open) => !open && handleClose()}>
            <DrawerContent>
                <SignupStepContent />
            </DrawerContent>
        </Drawer>
    )
}
