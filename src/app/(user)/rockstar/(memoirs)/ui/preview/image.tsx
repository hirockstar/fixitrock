'use client'

import { Image } from '@heroui/react'
import { FC } from 'react'

import { DriveItem } from '®types/drive'

const ImagePreview: FC<{ file: DriveItem }> = ({ file }) => {
    const src =
        file.file?.mimeType === 'image/heic'
            ? file.thumbnails?.[0]?.large?.url
            : file['@microsoft.graph.downloadUrl']

    return (
        <div className='overflow-hidden rounded-sm'>
            <Image
                isBlurred
                alt={file.name}
                className='border p-0.5 md:border-none'
                classNames={{ img: '!max-h-[60vh]', wrapper: 'mx-auto' }}
                src={src}
            />
        </div>
    )
}

export default ImagePreview
