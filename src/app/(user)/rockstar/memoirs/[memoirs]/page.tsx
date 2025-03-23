'use client'

import { Image } from '@heroui/react'
import { useParams } from 'next/navigation'
import { FaPlay } from 'react-icons/fa'

import { useMemoirs } from '®hooks/tanstack/query'
import { formatDuration } from '®lib/utils'

export default function Page() {
    const { memoirs } = useParams<{ memoirs: string }>()
    const { data, ref, isFetchingNextPage, isLoading } = useMemoirs(`/rockstar/memoirs/${memoirs}`)

    return (
        <div className='grid grid-cols-[repeat(auto-fill,_minmax(128px,_1fr))] gap-1 px-1 md:grid-cols-[repeat(auto-fill,_minmax(208px,_1fr))]'>
            {isLoading ? (
                <Skeleton />
            ) : (
                data?.map((child) => (
                    <div
                        key={child.id}
                        className='group relative scroll-m-10 overflow-hidden rounded-sm'
                    >
                        <Image
                            isZoomed
                            alt={child.name}
                            className='aspect-square min-h-32 cursor-pointer !rounded-[2px] object-cover md:min-h-52'
                            classNames={{
                                img: 'aspect-square min-h-32 md:min-h-52',
                                wrapper: 'aspect-square min-h-32 md:min-h-52',
                            }}
                            radius='none'
                            src={child?.thumbnails?.[0].large?.url}
                            width={child?.thumbnails?.[0].large?.width}
                        />
                        {child.file?.mimeType?.startsWith('video/') && (
                            <>
                                {child.video?.duration !== undefined && (
                                    <h1 className='absolute bottom-2 left-2 z-30 flex items-center gap-0.5 rounded bg-black bg-opacity-50 px-1 text-xs text-white'>
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
    )
}

const Skeleton = ({ length = 24 }: { length?: number }) => {
    return (
        <>
            {Array.from({ length }).map((_, index) => (
                <Image
                    key={index}
                    alt='Loading skeleton'
                    className='aspect-square min-h-32 min-w-full cursor-pointer object-cover md:min-h-52'
                    classNames={{
                        img: 'aspect-square min-h-32 min-w-full md:min-h-52',
                        wrapper: 'aspect-square min-h-32 min-w-full md:min-h-52',
                    }}
                    isLoading={true}
                    src='https://rdrive-ui.vercel.app/icons/rdrive.png'
                />
            ))}
        </>
    )
}
