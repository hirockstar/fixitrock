import { siteConfig } from '®config/site'

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
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
                name: 'Rock Star 💕',
                url: 'https://rockstar.bio',
            },
        ],
        publisher: 'Rock Star 💕',
        openGraph: {
            title: title || '',
            url: new URL(siteConfig.domain),
            type: 'website',
            images: `/drive/og?slug=/${drivePath}`,
            siteName: siteConfig.title,
        },
    }
}
