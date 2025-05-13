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

function ensureRecaptchaContainerExists() {
    if (!document.getElementById(RECAPTCHA_ID)) {
        const container = document.createElement('div')

        container.id = RECAPTCHA_ID
        container.style.display = 'none'
        document.body.appendChild(container)
    }
}

function getRecaptchaVerifier(): RecaptchaVerifier {
    if (typeof window === 'undefined') throw new Error('Recaptcha unavailable on server')

    ensureRecaptchaContainerExists()

    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
            auth, // ✅ auth should be first
            RECAPTCHA_ID,
            {
                size: 'invisible',
                callback: () => {},
                'expired-callback': () => {
                    window.recaptchaVerifier?.clear()
                    window.recaptchaVerifier = undefined
                },
            }
        )
    }

    return window.recaptchaVerifier
}

export async function sendOtp(phone: string): Promise<ConfirmationResult> {
    const verifier = getRecaptchaVerifier()

    await verifier.render() // required once
    const confirmation = await signInWithPhoneNumber(auth, phone, verifier)

    window.confirmationResult = confirmation

    return confirmation
}

export async function verifyOtp(code: string): Promise<UserCredential> {
    if (!window.confirmationResult) throw new Error('No confirmation result found')

    return await window.confirmationResult.confirm(code)
}
