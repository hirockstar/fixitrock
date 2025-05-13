'use client'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@heroui/react'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '®ui/dialog'
import { Drawer, DrawerContent } from '®ui/drawer'
import OTPInput from '®ui/otp-input'

import { useAuthOtp } from './use-signup-otp'

interface SignupModalProps {
    fullPage?: boolean
}

function isMobile() {
    if (typeof window === 'undefined') return false

    return window.innerWidth < 640
}

export default function SignupModal({ fullPage = false }: SignupModalProps) {
    const auth = useAuthOtp()
    const router = useRouter()

    let stepContent: React.ReactNode = null

    if (auth.step === 'phone') {
        stepContent = (
            <>
                <DialogHeader>
                    <DialogTitle>Sign up or Sign in with your phone</DialogTitle>
                    <DialogDescription>
                        Enter your Indian phone number to receive an OTP
                    </DialogDescription>
                </DialogHeader>
                <div className='p-4'>
                    <div className='flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900'>
                        <span className='flex select-none items-center pr-2 text-base text-gray-500 dark:text-gray-400'>
                            +91
                            <span className='mx-2 h-5 w-px bg-gray-200 dark:bg-zinc-700' />
                        </span>
                        <Input
                            className='flex-1 border-0 bg-transparent p-0 text-base shadow-none focus:ring-0'
                            disabled={auth.loading}
                            label={undefined}
                            maxLength={10}
                            placeholder='9876543210'
                            size='lg'
                            type='tel'
                            value={auth.phoneRaw}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10)

                                auth.setPhoneRaw(value)
                            }}
                        />
                    </div>
                    {auth.error && <div className='mt-2 text-sm text-red-500'>{auth.error}</div>}
                </div>
                <DialogFooter>
                    <Button
                        className='w-full'
                        color='primary'
                        isLoading={auth.loading}
                        onPress={auth.handleSendOtp}
                    >
                        Send OTP
                    </Button>
                    {!fullPage && (
                        <DialogClose asChild>
                            <Button className='w-full' variant='light'>
                                Cancel
                            </Button>
                        </DialogClose>
                    )}
                </DialogFooter>
            </>
        )
    } else if (auth.step === 'otp') {
        stepContent = (
            <>
                <DialogHeader>
                    <DialogTitle>Enter OTP</DialogTitle>
                    <DialogDescription>We sent a 6-digit code to {auth.phone}</DialogDescription>
                </DialogHeader>
                <div className='flex flex-col items-center p-4'>
                    <OTPInput
                        disabled={auth.loading}
                        length={6}
                        value={auth.otp}
                        onChange={auth.setOtp}
                    />
                    {auth.error && <div className='mt-2 text-sm text-red-500'>{auth.error}</div>}
                </div>
                <DialogFooter>
                    <Button
                        className='w-full'
                        color='primary'
                        isLoading={auth.loading}
                        onPress={auth.handleVerifyOtp}
                    >
                        Verify OTP
                    </Button>
                    {!fullPage && (
                        <DialogClose asChild>
                            <Button className='w-full' variant='light'>
                                Cancel
                            </Button>
                        </DialogClose>
                    )}
                </DialogFooter>
            </>
        )
    } else if (auth.step === 'details') {
        stepContent = (
            <>
                <DialogHeader>
                    <DialogTitle>Complete your profile</DialogTitle>
                    <DialogDescription>
                        Please enter your details to finish signing up.
                    </DialogDescription>
                </DialogHeader>
                <form
                    className='space-y-4 p-4'
                    onSubmit={(e) => {
                        e.preventDefault()
                        auth.handleSubmitDetails()
                    }}
                >
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
                    {auth.error && <div className='text-sm text-red-500'>{auth.error}</div>}
                    <DialogFooter>
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
                    </DialogFooter>
                </form>
            </>
        )
    }

    if (typeof window !== 'undefined' && isMobile()) {
        return (
            <Drawer
                open
                onOpenChange={(open) => {
                    if (!open) router.back()
                }}
            >
                <DrawerContent>{stepContent}</DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) router.back()
            }}
        >
            <DialogContent className='max-w-md'>{stepContent}</DialogContent>
        </Dialog>
    )
}
