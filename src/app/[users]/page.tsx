import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import { getUser } from '®actions/auth'
import { getTabs } from '®actions/supabase'

import { Profile, Tabs } from './ui'

type Props = {
    params: Promise<{ users: string }>
}

export default async function Users({ params }: Props) {
    const { users: rawUsername } = await params
    // Get everything before any slash
    const username = rawUsername.split('/')[0]
    const decoded = username ? decodeURIComponent(username) : ''
    const cleanUsername = decoded.startsWith('@') ? decoded.slice(1) : decoded

    // If username is empty, show 404
    if (!cleanUsername) {
        return notFound()
    }

    const user = await getUser(cleanUsername)

    if (!user) {
        return notFound()
    }

    // Fetch tabs for the user's role
    const tabs = await getTabs(user.role || 0)

    return (
        <div>
            <Profile {...user} />
            <div className='mx-auto -mt-12 p-1 2xl:px-[10%]'>
                <Tabs {...user} tabs={tabs} />
            </div>
        </div>
    )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { users: rawUsername } = await params
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

    return {
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
}
