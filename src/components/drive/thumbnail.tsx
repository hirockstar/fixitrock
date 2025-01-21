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
                    src={src}
                    alt={name}
                    isBlurred={type === 'Grid'}
                    className={`${type === 'Grid' ? 'aspect-video h-40 rounded-lg bg-default/5 p-2 dark:bg-default/10' : 'size-10 rounded-lg border p-0.5'} object-contain`}
                />
            ) : (
                <>
                    {isFolder && fallback ? (
                        <Image
                            src={fallback}
                            alt={name}
                            isBlurred={type === 'Grid'}
                            className={`${type === 'Grid' ? 'aspect-video h-40 object-contain p-2' : 'size-11'}`}
                        />
                    ) : (
                        <div
                            className={`${type === 'Grid' ? 'flex aspect-video h-40 items-center justify-center rounded-lg bg-default/5 dark:bg-default/10' : 'flex size-10 items-center rounded-lg border'}`}
                        >
                            <Icon
                                name={name}
                                className={`${type === 'Grid' ? '!size-14' : 'mx-auto !size-8 shrink-0'}`}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
