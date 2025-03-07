'use client'
import GalleryCard from '®/components/user/cards/gallery'
import { useGallery } from '®/hooks/useGallery'

export default function Page() {
    const { data } = useGallery('rockstar')

    return (
        <div className='mx-auto w-full p-1 sm:p-4 2xl:px-[10%]'>
            <div className='grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))]'>
                {data?.map((c) => <GalleryCard key={c.name} c={c} />)}
            </div>
        </div>
    )
}
