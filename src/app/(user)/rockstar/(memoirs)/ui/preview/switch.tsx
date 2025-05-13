'use client'
import React from 'react'

import { DriveItem } from '®types/drive'

import { ImagePreview } from './image'
import { VideoPreview } from './video'

const Switch: React.FC<{ file: DriveItem }> = ({ file }) => {
    const mimeType = file.file?.mimeType

    if (!mimeType) {
        return <div>No preview available</div>
    }

    if (mimeType.startsWith('image/')) {
        return <ImagePreview file={file} />
    }

    if (mimeType.startsWith('video/')) {
        return <VideoPreview file={file} />
    }
}

export default Switch
