'use client'
import React from 'react'

import { DriveItem } from '®/types/drive'

import ImagePreview from './image'
import { ReadMe } from './readme'
import Video from './video'

const Switch: React.FC<{ file: DriveItem }> = ({ file }) => {
    const mimeType = file?.file?.mimeType

    if (mimeType?.startsWith('image/')) {
        return <ImagePreview file={file} />
    }
    if (mimeType?.startsWith('video/')) {
        return <Video file={file} />
    }
    if (file.name.endsWith('.md') || file.name.endsWith('.mdx')) {
        return <ReadMe src={file['@microsoft.graph.downloadUrl'] ?? ''} />
    }
}

export default Switch
