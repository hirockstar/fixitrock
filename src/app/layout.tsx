import type { Metadata, Viewport } from 'next'

import Footer from '®components/footer'
import { META_THEME_COLORS, siteConfig } from '®config/site'
import { Providers } from '®provider'
import { Sonner } from '®ui/sonner'
import '../styles/globals.css'
import { cn } from '®lib/utils'
import { fontMono, fontSans } from '®lib/fonts'
import SearchBar from '®components/search/bar'

export default function RootLayout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode
    modal?: React.ReactNode
}>) {
    return (
        <html suppressHydrationWarning lang='en'>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
            try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
            } catch (_) {}
            `,
                    }}
                />
            </head>
            <body
                className={cn(
                    'min-h-svh bg-background font-sans antialiased',
                    fontSans.variable,
                    fontMono.variable
                )}
            >
                <Providers>
                    <div className='relative flex min-h-screen flex-col bg-background'>
                        <div className='flex-1 overflow-clip'>{children}</div>
                        {modal}
                        <SearchBar />
                        <Footer />
                        <Sonner />
                    </div>
                </Providers>
            </body>
        </html>
    )
}

export const metadata: Metadata = {
    title: {
        default: siteConfig.title,
        template: `%s - ${siteConfig.title}`,
    },
    description: siteConfig.description,
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: `${siteConfig.title}`,
        startupImage: ['/icons/fixitrock.png'],
    },
    icons: {
        icon: '/favicon.ico',
    },
    metadataBase: new URL(siteConfig.domain),
    openGraph: {
        title: siteConfig.title,
        description: siteConfig.description,
        url: new URL(siteConfig.domain),
        siteName: siteConfig.title,
        type: 'website',
        images: '/drive/og',
        locale: 'en_US',
    },
    category: 'technology',
}

export const viewport: Viewport = {
    maximumScale: 1,
    userScalable: false,
    themeColor: META_THEME_COLORS.dark,
}
