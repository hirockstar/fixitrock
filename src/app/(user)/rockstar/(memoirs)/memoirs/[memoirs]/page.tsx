'use client'

import { Button, Image, Navbar } from '@heroui/react'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { FaPlay } from 'react-icons/fa'

import { useMemoirs } from '®hooks/tanstack/query'
import { formatDuration } from '®lib/utils'

import { Name } from '../../ui/utils'
import { Preview } from '../../ui/preview'

export default function Page() {
    const { memoirs } = useParams<{ memoirs: string }>()
    const {
        data,
        ref,
        isFetchingNextPage,
        isLoading,
        error,
        selectItem,
        selectedItem,
        open,
        setOpen,
    } = useMemoirs(`/rockstar/memoirs/${memoirs}`)
    const pathname = usePathname()
    const title = memoirs.split('/').pop()

    return (
        <div className='flex flex-col gap-2'>
            <Navbar
                shouldHideOnScroll
                classNames={{
                    wrapper: 'h-auto w-full gap-1 p-0 py-1',
                }}
                maxWidth='full'
            >
                <div className='flex h-10 w-full select-none items-center gap-1.5'>
                    <Button
                        as={Link}
                        className='h-8 w-8 min-w-0 p-0'
                        href={`/${pathname.split('/').slice(1, -1).join('/')}`}
                        radius='full'
                        size='sm'
                        variant='light'
                    >
                        <ChevronLeft size={20} />
                    </Button>
                    <h1 className='text-nowrap text-base font-bold'>
                        {error ? 'Lost? Go Back' : Name(title as string)}
                    </h1>
                </div>
            </Navbar>
            <div className='grid grid-cols-[repeat(auto-fill,_minmax(96px,_1fr))] gap-1 md:grid-cols-[repeat(auto-fill,_minmax(208px,_1fr))]'>
                {isLoading ? (
                    <Skeleton />
                ) : (
                    data?.map((child) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                        <div
                            key={child.id}
                            className='group relative scroll-m-10 overflow-hidden rounded-[2px]'
                            onClick={() => selectItem(child)}
                        >
                            <Image
                                isZoomed
                                alt={child.name}
                                className='aspect-square min-h-24 cursor-pointer !rounded-[2px] object-cover md:min-h-52'
                                classNames={{
                                    img: 'aspect-square min-h-24 md:min-h-52',
                                    wrapper: 'aspect-square min-h-24 md:min-h-52',
                                }}
                                radius='none'
                                src={child?.thumbnails?.[0].large?.url}
                                width={child?.thumbnails?.[0].large?.width}
                            />
                            {child.file?.mimeType?.startsWith('video/') && (
                                <>
                                    {child.video?.duration !== undefined && (
                                        <h1 className='absolute bottom-1 left-1 z-30 flex items-center gap-1 rounded bg-black bg-opacity-50 px-1 text-xs text-white'>
                                            <FaPlay size={10} />
                                            {formatDuration(child.video.duration)}
                                        </h1>
                                    )}
                                    <div className='absolute inset-0 z-20 flex items-center justify-center overflow-hidden bg-black bg-opacity-20'>
                                        <FaPlay
                                            className='scale-100 transform text-white opacity-50 transition-transform group-hover:scale-110'
                                            size={40}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
                <div ref={ref} />
                {isFetchingNextPage && <Skeleton />}
            </div>
            {selectedItem && <Preview c={selectedItem} open={open} setOpen={setOpen} />}
        </div>
    )
}

const Skeleton = ({ length = 21 }: { length?: number }) => {
    return (
        <>
            {Array.from({ length }).map((_, index) => (
                <Image
                    key={index}
                    alt='Loading skeleton'
                    className='aspect-square min-h-24 min-w-full cursor-pointer object-cover md:min-h-52'
                    classNames={{
                        img: 'aspect-square min-h-24 min-w-full md:min-h-52',
                        wrapper: 'aspect-square min-h-24 min-w-full md:min-h-52',
                    }}
                    isLoading={true}
                    src='https://rdrive-ui.vercel.app/icons/rdrive.png'
                />
            ))}
        </>
    )
}
