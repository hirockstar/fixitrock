'use client'
import { Image, Skeleton, Tab, Tabs as UiTabs } from '@heroui/react'
import { FaPlay } from 'react-icons/fa'

import useTabs from '®/hooks/useTabs'
import { useTour } from '®/hooks/useTour'
import { formatDuration } from '®/lib/utils'
import { DriveItem } from '®/types/drive'

export default function Tabs({ gallery }: { gallery: string }) {
    const { tab, setTab } = useTabs('all')
    const { data, isLoading } = useTour(gallery)

    const videos = data?.value.filter((t) => t.file.mimeType?.startsWith('video/'))
    const photos = data?.value.filter((t) => t.file.mimeType?.startsWith('image/'))

    return (
        <UiTabs
            className='shadow-none'
            classNames={{
                base: 'flex justify-end',
                tab: '',
                cursor: 'rounded-lg border shadow-none',
            }}
            placement='top'
            selectedKey={tab}
            size='sm'
            variant='light'
            onSelectionChange={(key) => setTab(String(key))}
        >
            <Tab
                key='all'
                title={<TabTitle count={data?.value.length} isLoading={isLoading} title='All' />}
            >
                <GalleryGrid t={data?.value} />
            </Tab>
            <Tab
                key='photos'
                title={<TabTitle count={photos?.length} isLoading={isLoading} title='Photos' />}
            >
                <GalleryGrid t={photos} />
            </Tab>
            <Tab
                key='videos'
                title={<TabTitle count={videos?.length} isLoading={isLoading} title='Videos' />}
            >
                <GalleryGrid t={videos} />
            </Tab>
        </UiTabs>
    )
}

function TabTitle({
    title,
    count,
    isLoading,
}: {
    title: string
    count?: number
    isLoading: boolean
}) {
    return (
        <div className='flex items-center gap-1 text-sm font-medium'>
            <span>{title}</span>
            <Skeleton
                className='w-5 rounded text-[11px] font-semibold text-muted-foreground'
                isLoaded={!isLoading}
            >
                {count ?? 0}
            </Skeleton>
        </div>
    )
}

function GalleryGrid({ t }: { t?: DriveItem[] }) {
    return (
        <div className='grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-2'>
            {t?.map((t) => <TCard key={t.id} t={t} />)}
        </div>
    )
}

function TCard({ t }: { t: DriveItem }) {
    return (
        <div className='group relative overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md'>
            <Image
                isZoomed
                alt={t.name}
                className='aspect-square min-h-32 cursor-pointer object-cover'
                classNames={{
                    img: 'aspect-square min-h-32',
                    wrapper: 'aspect-square min-h-32',
                }}
                src={t?.thumbnails?.[0].large?.url}
                width={t?.thumbnails?.[0].large?.width}
            />
            {t.file?.mimeType?.startsWith('video/') && (
                <>
                    {t.video?.duration !== undefined && (
                        <div className='absolute bottom-2 left-2 z-30 flex items-center gap-0.5 rounded bg-black bg-opacity-50 px-1 text-[10px] text-white'>
                            <FaPlay size={10} />
                            {formatDuration(t.video.duration)}
                        </div>
                    )}
                    <div className='absolute inset-0 z-20 flex items-center justify-center overflow-hidden bg-black bg-opacity-20'>
                        <FaPlay
                            className='text-white opacity-50 transition-transform group-hover:scale-110'
                            size={36}
                        />
                    </div>
                </>
            )}
        </div>
    )
}
