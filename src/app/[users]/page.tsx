import { redirect } from 'next/navigation'

import { getUser } from '®actions/auth'

type Props = {
    params: Promise<{ users: string }>
}

export default async function Users({ params }: Props) {
    const { users: rawUsername } = await params
    const decoded = rawUsername ? decodeURIComponent(rawUsername) : ''

    const username = decoded.startsWith('@') ? decoded.slice(1) : decoded
    const user = await getUser(username)

    if (!user) return redirect('/')

    return (
        <div className='mx-auto max-w-xl p-4'>
            <h1 className='text-2xl font-bold'>@{user.username}</h1>
            <p className='text-gray-500'>{user.phone}</p>
        </div>
    )
}
