'use client'
import { useParams } from 'next/navigation'

export default function Page() {
    const { id } = useParams<{ id: string }>()

    return <p>Post: {id}</p>
}
