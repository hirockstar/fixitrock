'use client'
import { Image } from '@heroui/react'
import { FC } from 'react'

import { DriveItem } from '®/types/drive'
const ImagePreview: FC<{ c: DriveItem }> = ({ c }) => {
    // const src =
    //     c.file?.mimeType === 'image/heic'
    //         ? c.thumbnails?.[0]?.large?.url
    //         : c['@microsoft.graph.downloadUrl']

    return (
        <Image
            isBlurred
            alt={c.name}
            className='border p-0.5 md:border-none'
            classNames={{ img: '!max-h-[60vh]', wrapper: 'mx-auto' }}
            src={c['@microsoft.graph.downloadUrl']}
        />
    )
}

export default ImagePreview
