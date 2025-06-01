import type { Metadata, Viewport } from 'next'

import Footer from '®components/footer'
import { META_THEME_COLORS, siteConfig } from '®config/site'
import { Providers } from '®provider'
import '../styles/globals.css'
import '../styles/mdx.css'
import { cn } from '®lib/utils'
import { AuthProvider } from '®provider/auth'
import SearchBar from '®components/search/bar'
import { fontVariables } from '®lib/fonts'

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
            <body className={cn('bg-background min-h-svh font-sans antialiased', fontVariables)}>
                <AuthProvider>
                    <Providers>
                        <div className='bg-background relative flex min-h-screen flex-col'>
                            <div className='flex-1 overflow-clip'>{children}</div>
                            {modal}
                            <SearchBar />
                            <Footer />
                        </div>
                    </Providers>
                </AuthProvider>
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
