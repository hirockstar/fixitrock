'use client'

import { Image } from '@heroui/react'

import { DriveItem } from '®/types/drive'

export function ImagePreview({ file }: { file: DriveItem }) {
    const src =
        file.file?.mimeType === 'image/heic'
            ? file.thumbnails?.[0]?.large?.url
            : file['@microsoft.graph.downloadUrl']

    return (
        <div className='overflow-hidden rounded-sm'>
            <Image
                isBlurred
                alt={file.name}
                classNames={{
                    img: 'h-full w-full object-cover',
                    wrapper: 'mx-auto flex h-full w-full items-center justify-center',
                }}
                // height={file.image?.height}
                src={src}
                // width={file.image?.width}
            />
        </div>
    )
}
