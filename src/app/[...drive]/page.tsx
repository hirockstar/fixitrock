import { Drive } from '®/components/drive'
import { getMeta } from '®actions/drive/meta'
import { siteConfig } from '®/config/site'

export default async function DrivePage({ params }: { params: Promise<{ drive: string[] }> }) {
    const drive = (await params).drive

    return (
        <div className='mx-auto mt-4 w-full max-w-7xl p-2'>
            <Drive drive={drive} />
        </div>
    )
}

export async function generateMetadata({ params }: { params: Promise<{ drive: string[] }> }) {
    const drive = (await params).drive
    const drivePath = drive.join('/')

    const data = await getMeta(drivePath)

    return {
        title: data.name || 'Page Not Found',
        description: data.name || 'Not Found',
        keywords: data.name || 'Not Found',
        authors: [
            {
                name: 'Rock Star',
                url: 'https://rockstar.bio',
            },
        ],
        publisher: 'Rock Star',
        datePublished: data.lastModifiedDateTime || new Date().toISOString(),
        openGraph: {
            title: data.name || '',
            url: new URL(siteConfig.domain),
            type: 'website',
            images: `/api/drive/og?slug=/${drivePath}`,
            siteName: siteConfig.title,
        },
        cache: {
            maxAge: 3600,
            staleWhileRevalidate: 600,
        },
    }
}
