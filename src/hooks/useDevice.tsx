import type { ReactNode } from 'react'

import React, { useMemo } from 'react'
import { isMobile, isTablet, isDesktop } from 'react-device-detect'
import { Smartphone, Tablet, Laptop, Monitor, Download } from 'lucide-react'

export type Device = 'mobile' | 'tablet' | 'laptop' | 'desktop'

export interface DeviceInfo {
    device: Device
    title: string
    icon: ReactNode
}

export function useDevice(): DeviceInfo {
    // Determine device type using react-device-detect
    const device = useMemo<Device>(() => {
        if (isMobile) return 'mobile'
        if (isTablet) return 'tablet'
        if (isDesktop) {
            if (typeof window !== 'undefined' && window.innerWidth <= 1024) return 'laptop'

            return 'desktop'
        }

        return 'desktop'
    }, [])

    const { title, icon } = useMemo(() => {
        switch (device) {
            case 'mobile':
                return { title: 'Install on Phone', icon: <Smartphone size={20} /> }
            case 'tablet':
                return { title: 'Install on Tablet', icon: <Tablet size={20} /> }
            case 'laptop':
                return { title: 'Install on Laptop', icon: <Laptop size={20} /> }
            case 'desktop':
                return { title: 'Install on Desktop', icon: <Monitor size={20} /> }
            default:
                return { title: 'Install App', icon: <Download size={20} /> }
        }
    }, [device])

    return { device, title, icon }
}
