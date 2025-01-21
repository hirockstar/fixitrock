'use client'

import { FC } from 'react'
import { DriveItem } from '®/types/drive'
import { VideoPlayer } from './videoplayer'

const VideoPreview: FC<{ file: DriveItem }> = ({ file }) => {
    return (
        <div className='flex flex-col overflow-hidden'>
            <VideoPlayer
                videoSrc={file['@microsoft.graph.downloadUrl'] ?? ''}
                poster={file.thumbnails?.[0].large?.url}
                width={file.video?.width}
                height={file.video?.height}
            />
        </div>
    )
}

export default VideoPreview
