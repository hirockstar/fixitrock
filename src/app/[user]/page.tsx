import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'

import { getTabs } from '®actions/supabase'
import { getUser } from '®actions/user'
import { getProducts } from '®actions/user/products'

import { Profile, Tabs } from './ui'

type Props = {
    params: Promise<{ user: string }>
}

export default async function Users({ params }: Props) {
    const rawUsername = (await params).user as string
    const username = decodeURIComponent(rawUsername.split('/')[0] || '')

    if (!username.startsWith('@')) {
        redirect(`/@${username}`)
    }

    const cleanUsername = username.slice(1)

    if (!cleanUsername) return notFound()

    const user = await getUser(cleanUsername)

    if (!user) return notFound()

    // Fetch tabs for the user's role
    const tabs = await getTabs(user.role || 0)
    const { products, canManage } = await getProducts(cleanUsername)

    return (
        <div>
            <Profile canManage={canManage} user={user} />
            <div className='mx-auto -mt-12 p-1 md:-mt-8 2xl:px-[10%]'>
                <Tabs canManage={canManage} products={products} tabs={tabs} user={user} />
            </div>
        </div>
    )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { user: rawUsername } = await params
    const username = rawUsername.split('/')[0]
    const decoded = username ? decodeURIComponent(username) : ''
    const cleanUsername = decoded.startsWith('@') ? decoded.slice(1) : decoded

    const user = await getUser(cleanUsername)

    if (!user) {
        return {
            title: 'User Not Found',
            description: 'The requested user profile could not be found.',
        }
    }

    // Base metadata
    const metadata: Metadata = {
        title: user.name,
        description: user.bio,
        // Additional metadata fields
        openGraph: {
            title: user.name,
            description: user.bio || '',
            images: user.avatar ? [user.avatar as string] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: user.name,
            description: user.bio || '',
            images: user.avatar ? [user.avatar as string] : undefined,
        },
        creator: user.username,
    }

    // Add PWA manifest for shopkeepers (role 2)
    if (user.role === 2) {
        metadata.manifest = `/manifest/${user.username}`
        metadata.appleWebApp = {
            capable: true,
            statusBarStyle: 'black-translucent',
            title: user.name,
            startupImage: user.avatar || '/fallback/boy.png',
        }
    }

    return metadata
}
