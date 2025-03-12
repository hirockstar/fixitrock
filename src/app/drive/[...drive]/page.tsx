'use client'

import { useParams } from 'next/navigation'
import { useDrive } from '®tanstack/query'
import Breadcrumb from '®ui/breadcrumb'
import { Input } from '../ui'

export default function Page() {
    const { drive } = useParams<{ drive: string[] }>()
    const path = drive.join('/')
    const { error, query, setQuery } = useDrive(path)
    const title = path.split('/').pop()
    return (
        <main className='flex flex-col gap-4'>
            <Breadcrumb />
            <div className='flex space-x-1.5'>
                <Input
                    hotKey='/'
                    placeholder={error ? 'Oops, Page Not Found!' : `Search in ${title}`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
        </main>
    )
}
