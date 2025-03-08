'use client'

import GalleryCard from '®/components/user/cards/gallery'
import { useGallery } from '®/hooks/useGallery'
import { BlogCardAnimation, fromLeftVariant } from '®/lib/FramerMotionVariants'
import AnimatedDiv from '®/ui/farmer/div'

export default function Page() {
    const { data } = useGallery('rockstar')

    return (
        <div className='mx-auto w-full space-y-4 p-1 py-4 sm:p-4 2xl:px-[10%]'>
            {/* <Input placeholder='Production . . .' /> */}

            <div className='grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-2 px-1'>
                {data?.map((c) => (
                    <AnimatedDiv
                        key={c.name}
                        mobileVariants={BlogCardAnimation}
                        variants={fromLeftVariant}
                    >
                        <GalleryCard c={c} />
                    </AnimatedDiv>
                ))}
            </div>
        </div>
    )
}
