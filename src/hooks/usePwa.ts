'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
    prompt(): Promise<void>
}

export function usePwa(role?: number) {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstallable, setIsInstallable] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        // Check if app is already installed
        const checkIfInstalled = () => {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setIsInstalled(true)
                setIsInstallable(false)
            }
        }

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            setIsInstallable(true)
        }

        // Listen for app installed event
        const handleAppInstalled = () => {
            setIsInstalled(true)
            setIsInstallable(false)
            setDeferredPrompt(null)
        }

        // Check if already installed
        checkIfInstalled()

        // Add event listeners
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [])

    const installPWA = async () => {
        if (!deferredPrompt) {
            return
        }

        try {
            // Show the install prompt
            deferredPrompt.prompt()

            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice

            if (outcome === 'accepted') {
                setIsInstalled(true)
                setIsInstallable(false)
            }

            // Clear the deferred prompt
            setDeferredPrompt(null)
        } catch {}
    }

    // If role is not 2, return only installPWA (no-op)
    if (role !== 2) {
        return {
            installPWA: () => {},
        }
    }

    return {
        isInstallable: isInstallable && !isInstalled,
        isInstalled,
        installPWA,
    }
}
