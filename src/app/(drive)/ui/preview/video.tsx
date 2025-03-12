'use client'

import { FC } from 'react'

import { DriveItem } from '®/types/drive'

import { VideoPlayer } from './videoplayer'

const VideoPreview: FC<{ file: DriveItem }> = ({ file }) => {
    return (
        <div className='flex flex-col overflow-hidden'>
            <VideoPlayer
                height={file.video?.height}
                poster={file.thumbnails?.[0].large?.url}
                videoSrc={file['@microsoft.graph.downloadUrl'] ?? ''}
                width={file.video?.width}
            />
        </div>
    )
}

export default VideoPreview
