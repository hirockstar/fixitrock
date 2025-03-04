'use client'
import { Button, Tab, Tabs as UiTabs } from '@heroui/react'
import { LayoutGrid } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'

import { useGallery } from '®/hooks/useGallery'

import GalleryCard from './gallery/card'

export default function Tabs({ username }: { username: string }) {
    const router = useRouter()
    const { data } = useGallery(username)

    return (
        <UiTabs
            classNames={{
                base: 'w-full border-b',
            }}
            variant='underlined'
        >
            <Tab key='home' title='Home'>
                <div className='flex items-center justify-between px-0.5 py-4'>
                    <h1 className='font-serif text-lg font-bold'>Latest Gallery</h1>
                    <Button
                        isIconOnly
                        className='border bg-background/30 backdrop-blur data-[hover=true]:bg-muted/50'
                        size='sm'
                        onPress={() => router.push(`/${username}/gallery`)}
                    >
                        <LayoutGrid size={20} />
                    </Button>
                </div>
                <div className='grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))]'>
                    {data?.map((c) => <GalleryCard key={c.name} c={c} />)}
                </div>
            </Tab>
            <Tab key='posts' title='Posts' />
            <Tab key='photos' title='Photos' />
            <Tab key='videos' title='Videos' />
            <Tab key='about' title='About' />
        </UiTabs>
    )
}
