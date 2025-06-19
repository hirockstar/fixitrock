import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import { getUser } from '®actions/auth'

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

    return (
        <div className='mx-auto max-w-xl p-4'>
            <h1 className='text-2xl font-bold'>@{user.username}</h1>
            <p className='text-gray-500'>{user.phone}</p>
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
            description: 'The requested user profile could not be found.'
        }
    }

    return {
        title: `@${user.username}`,
        description: `Profile of ${user.name}`
    }
}
