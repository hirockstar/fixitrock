'use client'
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
    UserCredential,
} from 'firebase/auth'

import { auth } from '®lib/firebase'

// Ensure window typing for recaptcha
declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier
        confirmationResult?: ConfirmationResult
    }
}

const RECAPTCHA_ID = 'recaptcha-container'

function getRecaptchaVerifier() {
    if (typeof window === 'undefined') throw new Error('recaptcha unavailable on server')
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, RECAPTCHA_ID, {
            size: 'invisible',
            callback: () => {},
        })
    }

    return window.recaptchaVerifier
}

export async function sendOtp(phone: string): Promise<ConfirmationResult> {
    const verifier = getRecaptchaVerifier()

    // Render if not yet rendered
    await verifier.render()
    const confirmation = await signInWithPhoneNumber(auth, phone, verifier)

    window.confirmationResult = confirmation

    return confirmation
}

export async function verifyOtp(code: string): Promise<UserCredential> {
    if (!window.confirmationResult) throw new Error('No confirmation result found')
    const cred = await window.confirmationResult.confirm(code)

    return cred
}
