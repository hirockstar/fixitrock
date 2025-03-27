'use client'
import React from 'react'

import { DriveItem } from '®types/drive'

import { ImagePreview } from './image'

const Switch: React.FC<{ file: DriveItem }> = ({ file }) => {
    const mimeType = file.file?.mimeType

    if (!mimeType) {
        return <div>No preview available</div>
    }

    if (mimeType.startsWith('image/')) {
        return <ImagePreview file={file} />
    }

    if (mimeType.startsWith('video/')) {
        return (
            <div className='mx-auto flex h-64 flex-col items-center justify-center text-lg font-bold'>
                Video player in production
            </div>
        )
    }
}

export default Switch
