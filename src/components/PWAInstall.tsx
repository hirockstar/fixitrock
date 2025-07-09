'use client'

import { Button } from '@heroui/react'
import { Download, Smartphone, Monitor, Tablet, Laptop } from 'lucide-react'
import { useEffect, useState } from 'react'

import { User } from '®app/login/types'
import { usePWAInstall } from '®hooks'

interface PWAInstallProps {
    user: User
}

export function PWAInstall({ user }: PWAInstallProps) {
    const { isInstallable, installPWA } = usePWAInstall()
    const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'laptop' | 'desktop'>(
        'desktop'
    )

    useEffect(() => {
        const detectDevice = () => {
            const userAgent = navigator.userAgent.toLowerCase()
            const screenWidth = window.innerWidth

            // iOS Detection (more comprehensive)
            const isIOS = /iphone|ipad|ipod|macintosh/i.test(userAgent)

            // Android Detection
            const isAndroid = /android/i.test(userAgent)

            // Windows Phone Detection
            const isWindowsPhone = /windows phone/i.test(userAgent)

            // Mobile OS Detection
            const isMobileOS = isIOS || isAndroid || isWindowsPhone

            if (isMobileOS) {
                // iOS specific detection
                if (isIOS) {
                    if (/iphone/i.test(userAgent)) {
                        setDeviceType('mobile')
                    } else if (/ipad/i.test(userAgent)) {
                        setDeviceType('tablet')
                    } else if (/ipod/i.test(userAgent)) {
                        setDeviceType('mobile')
                    } else {
                        // Mac with touch capabilities (iPad-like)
                        setDeviceType('tablet')
                    }
                }
                // Android specific detection
                else if (isAndroid) {
                    if (screenWidth <= 768) {
                        setDeviceType('mobile')
                    } else {
                        setDeviceType('tablet')
                    }
                }
                // Windows Phone
                else if (isWindowsPhone) {
                    setDeviceType('mobile')
                }
            } else {
                // Desktop/Laptop detection
                if (screenWidth <= 1024) {
                    setDeviceType('laptop')
                } else {
                    setDeviceType('desktop')
                }
            }
        }

        detectDevice()
        window.addEventListener('resize', detectDevice)

        return () => window.removeEventListener('resize', detectDevice)
    }, [])

    // Only show for shopkeepers (role 2)
    if (user.role !== 2) {
        return null
    }

    // Don't show if not installable
    if (!isInstallable) {
        return null
    }

    const getDeviceIcon = () => {
        switch (deviceType) {
            case 'mobile':
                return <Smartphone size={20} />
            case 'tablet':
                return <Tablet size={20} />
            case 'laptop':
                return <Laptop size={20} />
            case 'desktop':
                return <Monitor size={20} />
            default:
                return <Download size={20} />
        }
    }

    const getDeviceText = () => {
        switch (deviceType) {
            case 'mobile':
                return 'Install on Phone'
            case 'tablet':
                return 'Install on Tablet'
            case 'laptop':
                return 'Install on Laptop'
            case 'desktop':
                return 'Install on Desktop'
            default:
                return 'Install App'
        }
    }

    return (
        <Button
            className='h-[34px] rounded-lg'
            color='secondary'
            startContent={getDeviceIcon()}
            onPress={installPWA}
        >
            {getDeviceText()}
        </Button>
    )
}
