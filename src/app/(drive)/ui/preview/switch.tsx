'use client'
import React from 'react'

import ImagePreview from './image'
import Mdx from './mdx'
import VideoPreview from './video'

import { DriveItem } from '®/types/drive'

const Switch: React.FC<{ file: DriveItem }> = ({ file }) => {
    const mimeType = file?.file?.mimeType

    if (mimeType?.startsWith('image/')) {
        return <ImagePreview file={file} />
    }
    if (mimeType?.startsWith('video/')) {
        return <VideoPreview file={file} />
    }
    if (file.name.endsWith('.md') || file.name.endsWith('.mdx')) {
        return <Mdx src={file['@microsoft.graph.downloadUrl'] ?? ''} />
    }
}

export default Switch
