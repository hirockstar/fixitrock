import Tour from './tour'
export default async function Page({ params }: { params: Promise<{ gallery: string }> }) {
    const gallery = (await params).gallery

    return (
        <div className='mx-auto w-full p-1 sm:p-4 2xl:px-[10%]'>
            <Tour gallery={gallery} />
        </div>
    )
}

export async function generateMetadata({ params }: { params: Promise<{ gallery: string }> }) {
    const tour = (await params).gallery
    const title = Name(tour)

    return {
        title: title || 'Page Not Found',
        description: title || 'Not Found',
        keywords: title || 'Not Found',
        authors: [
            {
                name: 'Rock Star',
                url: 'https://rockstar.bio',
            },
        ],
        publisher: 'Rock Star',
        // openGraph: {
        //     title: title || '',
        //     url: new URL(siteConfig.domain),
        //     type: 'website',
        //     images: `/api/drive/og?slug=/${drivePath}`,
        //     siteName: siteConfig.title,
        // },
    }
}

export function Name(name: string) {
    return name.replace(/^\d{4}-\d{2}-\d{2}-|\.[^.]+$/g, '')
}
