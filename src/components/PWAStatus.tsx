'use client'

import { useEffect, useState } from 'react'

import { usePWAInstall } from '®hooks'

export function PWAStatus() {
    const { isInstallable } = usePWAInstall()
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {
        // Check if app is running in standalone mode (installed)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsStandalone(true)
        }
    }, [])

    if (isStandalone) {
        return (
            <div className='fixed right-4 bottom-4 z-50 rounded-lg bg-green-500 p-3 text-white shadow-lg'>
                <p className='text-sm'>✓ Running as installed app</p>
            </div>
        )
    }

    if (isInstallable) {
        return (
            <div className='fixed right-4 bottom-4 z-50 rounded-lg bg-blue-500 p-3 text-white shadow-lg'>
                <p className='text-sm'>📱 App can be installed</p>
            </div>
        )
    }

    return null
}
