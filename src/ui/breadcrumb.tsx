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
            className='sticky left-0 z-10 ml-2'
            radius='full'
            size='sm'
            variant='light'
            onPress={() => router.push('/drive')}
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
            <nav className='flex items-center rounded-md border'>
                <HomeCrumb />
                <ScrollShadow
                    hideScrollBar
                    isEnabled
                    className='inline-flex flex-row-reverse items-center'
                    orientation='horizontal'
                    visibility='auto'
                >
                    {paths
                        .slice(0)
                        .reverse()
                        .map((p: string, i: number) => (
                            <div
                                key={i}
                                className={`flex items-center ${p === 'drive' ? 'hidden' : ''}`}
                            >
                                <Button
                                    aria-label={p.replaceAll('-', ' ')}
                                    className='m-1 h-7 min-w-0 rounded p-1'
                                    isDisabled={i === 0}
                                    startContent={<ChevronRight />}
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
                            </div>
                        ))}
                </ScrollShadow>
            </nav>
        )
    }

    return <HomeCrumb />
}

export default Breadcrumb
