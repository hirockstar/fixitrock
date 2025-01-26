'use client'

import React from 'react'
import { Image } from '@heroui/react'

import Icon from '®/lib/utils/Icon'

interface ThumbnailProps {
    src?: string
    fallback?: string
    name: string
    type: 'Grid' | 'List'
}

export const Thumbnail: React.FC<ThumbnailProps> = ({ src, fallback, name, type }) => {
    const isFolder = !name.includes('.')

    return (
        <div className='flex shrink-0 items-center justify-center'>
            {src ? (
                <Image
                    alt={name}
                    className={`${type === 'Grid' ? 'aspect-video h-40 rounded-md bg-default/5 p-2 dark:bg-default/10' : 'size-10 rounded-md border p-0.5'} object-contain`}
                    isBlurred={type === 'Grid'}
                    loading='lazy'
                    src={src}
                />
            ) : (
                <>
                    {isFolder && fallback ? (
                        <Image
                            alt={name}
                            className={`${type === 'Grid' ? 'aspect-video h-40 object-contain p-2' : 'size-11'}`}
                            isBlurred={type === 'Grid'}
                            loading='lazy'
                            src={fallback}
                        />
                    ) : (
                        <div
                            className={`${type === 'Grid' ? 'flex aspect-video h-40 items-center justify-center rounded-md bg-default/5 dark:bg-default/10' : 'flex size-10 items-center rounded-md border'}`}
                        >
                            <Icon
                                className={`${type === 'Grid' ? '!size-14' : 'mx-auto !size-7 shrink-0'}`}
                                name={name}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
