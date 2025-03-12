import { Drive } from '../ui'

import { siteConfig } from '®/config/site'

export default async function DrivePage({ params }: { params: Promise<{ drive: string[] }> }) {
    const drive = (await params).drive
    const drivePath = drive.join('/')

    return (
        <div className='mx-auto w-full space-y-4 p-1 py-4 sm:p-4 2xl:px-[10%]'>
            <Drive drive={`/${drivePath}`} />
        </div>
    )
}

export async function generateMetadata({ params }: { params: Promise<{ drive: string[] }> }) {
    const drive = (await params).drive
    const drivePath = drive.join('/')
    const title = drive[drive.length - 1]

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
        openGraph: {
            title: title || '',
            url: new URL(siteConfig.domain),
            type: 'website',
            images: `/api/drive/og?slug=/${drivePath}`,
            siteName: siteConfig.title,
        },
    }
}
