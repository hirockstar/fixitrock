'use client'

import { Button, ScrollShadow } from '@heroui/react'
import { useRouter } from 'nextjs-toploader/app'
import { usePathname } from 'next/navigation'

import { ChevronRight, Home } from './icons'

const HomeCrumb = () => {
    const router = useRouter()

    return (
        <Button
            isIconOnly
            aria-label='Fix iT Rock'
            radius='full'
            size='sm'
            variant='light'
            onPress={() => router.push('/')}
        >
            <Home />
        </Button>
    )
}

const Breadcrumb: React.FC = () => {
    const router = useRouter()
    const pathname = usePathname()
    const paths = pathname.split('/').filter(Boolean)

    if (paths.length > 0) {
        return (
            <nav className='flex items-center rounded-lg border'>
                <div className='sticky left-0 z-10 flex items-center px-1'>
                    <HomeCrumb />
                </div>
                <ScrollShadow
                    hideScrollBar
                    isEnabled
                    className='inline-flex flex-row-reverse items-center pl-1'
                    orientation='horizontal'
                    visibility='auto'
                >
                    {paths
                        .slice(0)
                        .reverse()
                        .map((p: string, i: number) => (
                            <span key={i} className='flex items-center py-1.5'>
                                <ChevronRight className='h-5' />
                                <Button
                                    aria-label={p}
                                    className='mx-0.5'
                                    isDisabled={i === 0}
                                    radius='full'
                                    size='sm'
                                    variant='light'
                                    onPress={() => {
                                        const href = `/${paths
                                            .slice(0, paths.length - i)
                                            .map((p) => encodeURIComponent(p))
                                            .join('/')}`

                                        router.push(href)
                                    }}
                                >
                                    {p.replaceAll('-', ' ')}
                                </Button>
                            </span>
                        ))}
                </ScrollShadow>
            </nav>
        )
    }

    return <HomeCrumb />
}

export default Breadcrumb
