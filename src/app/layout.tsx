import type { Metadata, Viewport } from 'next'

import { UserDrawer } from '@/app/[user]/ui'
import Footer from '@/components/footer'
import { META_THEME_COLORS, siteConfig } from '@/config/site'
import { AuthProvider, Providers } from '@/provider'
import '../styles/globals.css'
import { cn } from '@/lib/utils'
import { SearchBar } from '@/components/search/bar'
import { fontVariables } from '@/lib/fonts'
import { ErrorBoundary } from '@/components/error'
import { userSession } from '@/actions/user'

import { Download } from './(space)/ui/download'

export default async function RootLayout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode
    modal?: React.ReactNode
}>) {
    const { user, navigation } = await userSession()

    return (
        <html suppressHydrationWarning lang='en'>
            <head>
                {/* Browser compatibility meta tags */}
                <meta content='IE=edge' httpEquiv='X-UA-Compatible' />
                <meta
                    content='width=device-width, initial-scale=1, maximum-scale=5'
                    name='viewport'
                />

                <script
                    dangerouslySetInnerHTML={{
                        __html: `
            try {
                if (typeof localStorage !== 'undefined' && localStorage.theme === 'dark' || 
                    ((!('theme' in localStorage) || localStorage.theme === 'system') && 
                     window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    const meta = document.querySelector('meta[name="theme-color"]');
                    if (meta) meta.setAttribute('content', '${META_THEME_COLORS.dark}');
                }
            } catch (e) {
                console.warn('Theme detection failed:', e);
            }
            `,
                    }}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
            if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                        .then(function(registration) {
                            console.log('SW registered: ', registration);
                        })
                        .catch(function(registrationError) {
                            console.log('SW registration failed: ', registrationError);
                        });
                });
            }
            `,
                    }}
                />
            </head>
            <body className={cn('bg-background min-h-svh font-sans antialiased', fontVariables)}>
                <AuthProvider>
                    <ErrorBoundary>
                        <Providers>
                            <div className='bg-background relative flex min-h-screen flex-col'>
                                <div className='flex-1 overflow-clip'>{children}</div>
                                {modal}
                                <SearchBar navigation={navigation} user={user}>
                                    <Download />
                                    <UserDrawer navigation={navigation} user={user} />
                                </SearchBar>
                                <Footer />
                            </div>
                        </Providers>
                    </ErrorBoundary>
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
        images: '/space/og',
        locale: 'en_US',
    },
    category: 'technology',
}

export const viewport: Viewport = {
    maximumScale: 1,
    userScalable: false,
    themeColor: META_THEME_COLORS.dark,
}
