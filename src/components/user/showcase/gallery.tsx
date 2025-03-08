import Autoplay from 'embla-carousel-autoplay'

import { useGallery } from '®/hooks/useGallery'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '®/ui/carousel'
import { TitleAction } from '®/ui/titleaction'

import GalleryCard from '../cards/gallery'

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
                    {data?.map((c, index) => (
                        <CarouselItem key={index} className='sm:basis-1/2 2xl:basis-1/4'>
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
