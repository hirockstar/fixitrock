import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import { Brand } from '®types/brands'

const fallback =
    'https://cdn3d.iconscout.com/3d/premium/thumb/astronaut-riding-rocket-while-waiving-hand-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--hello-logo-gesture-pack-aerospace-illustrations-4431886.png'

export function useBrandImg(brand: Brand | null | undefined) {
    const { theme } = useTheme()
    const [src, setSrc] = useState(fallback)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        if (!brand) {
            setSrc(fallback)
            setIsLoading(false)

            return
        }
        if (brand.logo?.light && brand.logo?.dark) {
            setSrc(theme === 'dark' ? brand.logo.dark : brand.logo.light)
        } else {
            setSrc(brand.logo?.light || brand.logo?.dark || fallback)
        }
        setIsLoading(false)
    }, [brand, theme])

    return { src, isLoading }
}
