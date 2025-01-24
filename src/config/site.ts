export type SiteConfig = typeof siteConfig

export const siteConfig = {
    title: 'Fix iT Rock',
    tagline: 'My tagline',
    description:
        'We Provide Mobile Firmwares Drivers Flash Tool FRP Dump FIle EMMC ISP PinOut Samsung MDM File Windows Files.',
    domain: process.env.NEXT_PUBLIC_SITE_URL || 'https://fixitrock.com',
    baseDirectory: '/FixiTRock',
    cacheControlHeader: 'max-age=0, s-maxage=60, stale-while-revalidate',
}

export const META_THEME_COLORS = {
    light: '#ffffff',
    dark: '#00000',
}
