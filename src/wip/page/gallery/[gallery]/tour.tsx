'use client'
import { Button, Image, Navbar, Skeleton, Card as UICard } from '@heroui/react'
import { ChevronLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { FaPlay } from 'react-icons/fa'

import useTabs from '®/hooks/useTabs'
import { BlogCardAnimation, fromLeftVariant } from '®/lib/FramerMotionVariants'
import { formatDuration } from '®/lib/utils'
import { DriveItem } from '®/types/drive'
import AnimatedDiv from '®/ui/farmer/div'

import { useTour } from '®tanstack/query'

const FilterButtons = ({
    filter,
    setFilter,
    getCount,
}: {
    filter: string
    setFilter: (filter: string) => void
    getCount: (type: string) => number
}) => (
    <div className='flex items-center gap-1'>
        {['all', 'photos', 'videos'].map((tab) => (
            <Button
                key={tab}
                className={`h-6 gap-1.5 rounded-lg bg-muted/70 px-1.5 backdrop-blur ${filter === tab ? 'bg-primary text-white' : ''}`}
                size='sm'
                onPress={() => setFilter(tab)}
            >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} <span>{getCount(tab)}</span>
            </Button>
        ))}
    </div>
)

const Grid = ({ data, isLoading }: { data?: DriveItem[]; isLoading: boolean }) => {
    if (isLoading) {
        return <SkeletonGrid />
    }

    if (!data?.length) {
        return (
            <div className='flex h-32 items-center justify-center'>
                <p className='text-xl text-muted-foreground'>No items found</p>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-2'>
            {data.map((item) => (
                <AnimatedDiv
                    key={item.id}
                    mobileVariants={BlogCardAnimation}
                    variants={fromLeftVariant}
                >
                    <Card item={item} />
                </AnimatedDiv>
            ))}
        </div>
    )
}

const SkeletonGrid = () => (
    <div className='grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-2'>
        {Array(36)
            .fill(null)
            .map((_, i) => (
                <Skeleton key={i} className='aspect-square min-h-32 rounded-xl' />
            ))}
    </div>
)

const Card = ({ item }: { item: DriveItem }) => {
    const router = useRouter()
    const path = usePathname()

    return (
        <UICard
            isPressable
            className='group relative overflow-hidden'
            onPress={() => router.push(`${path}/${item.id}`, { scroll: false })}
        >
            <Image
                alt={item.name}
                className='aspect-square min-h-32 cursor-pointer object-cover'
                src={item?.thumbnails?.[0].large?.url}
                width={item?.thumbnails?.[0].large?.width}
            />
            {item.file?.mimeType?.startsWith('video/') && (
                <>
                    {item.video?.duration !== undefined && (
                        <div className='absolute bottom-2 left-2 z-30 flex items-center gap-0.5 rounded bg-black bg-opacity-50 px-1 text-[10px] text-white'>
                            <FaPlay size={10} />
                            {formatDuration(item.video.duration)}
                        </div>
                    )}
                    <div className='absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-black bg-opacity-20'>
                        <FaPlay
                            className='text-white opacity-50 transition-transform group-hover:scale-110'
                            size={36}
                        />
                    </div>
                </>
            )}
        </UICard>
    )
}

export default function Tour({ gallery }: { gallery: string }) {
    const router = useRouter()
    const { data, isLoading } = useTour(gallery)
    const { tab: filter, setTab: setFilter } = useTabs('all')

    const videos = data?.value.filter((item) => item.file.mimeType?.startsWith('video/'))
    const photos = data?.value.filter((item) => item.file.mimeType?.startsWith('image/'))
    const filteredData = filter === 'all' ? data?.value : filter === 'photos' ? photos : videos

    const getCount = (type: string) => {
        switch (type) {
            case 'all':
                return data?.value.length || 0
            case 'photos':
                return photos?.length || 0
            case 'videos':
                return videos?.length || 0
            default:
                return 0
        }
    }

    return (
        <div className='flex flex-col space-y-4'>
            <Navbar
                isBordered
                shouldHideOnScroll
                classNames={{ wrapper: 'h-auto p-1' }}
                maxWidth='full'
            >
                <Button
                    className='h-10 min-w-8 bg-transparent px-1.5 data-[hover=true]:bg-muted/50'
                    radius='full'
                    onPress={() => router.push('/rockstar/gallery')}
                >
                    <ChevronLeft size={28} />
                </Button>
                <FilterButtons filter={filter} getCount={getCount} setFilter={setFilter} />
            </Navbar>
            <Grid data={filteredData} isLoading={isLoading} />
        </div>
    )
}
