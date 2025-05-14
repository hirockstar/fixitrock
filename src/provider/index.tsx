'use client'

import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'
import { useRouter } from 'nextjs-toploader/app'
import { useState } from 'react'

import { siteConfig } from '®config/site'

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())
    const router = useRouter()
    const useHref = (href: string) => siteConfig.domain + href

    return (
        <ThemeProvider
            disableTransitionOnChange
            enableColorScheme
            enableSystem
            attribute='class'
            defaultTheme='system'
        >
            <QueryClientProvider client={queryClient}>
                <HeroUIProvider navigate={router.push} spinnerVariant='spinner' useHref={useHref}>
                    <ToastProvider maxVisibleToasts={9} toastProps={{ radius: 'lg' }} />
                    {children}
                    <NextTopLoader color='hsl(var(--ring))' height={2} showSpinner={false} />
                </HeroUIProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}
