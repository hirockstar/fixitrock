import Autoplay from 'embla-carousel-autoplay'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '®/ui/carousel'
import { TitleAction } from '®/ui/titleaction'

import GalleryCard from '../cards/gallery'

import { useGallery } from '®tanstack/query'

export function Gallery({ username }: { username: string }) {
    const { data, isLoading } = useGallery(username)

    return (
        <TitleAction href={`/${username}/gallery`} title='Gallery'>
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 2000,
                    }),
                ]}
            >
                <CarouselContent>
                    {data?.map((c) => (
                        <CarouselItem key={c.name} className='basis-[320px]'>
                            <GalleryCard key={c.name} c={c} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {!isLoading && (
                    <>
                        <CarouselPrevious />
                        <CarouselNext />
                    </>
                )}
            </Carousel>
        </TitleAction>
    )
}
