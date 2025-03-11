import { DriveItem } from '®/types/drive'

import ImagePreview from './image'

export function Preview({ c, isImage }: { c: DriveItem; isImage: boolean }) {
    return <>{isImage ? <ImagePreview c={c} /> : <>video {c.name}</>}</>
}
