'use client'
import { Image } from '@heroui/react'
import Link from 'next/link'

import { FRP } from '@/types/frp'

interface FRPCardProps {
    data: FRP[]
}
export default function FRPCard({ data }: FRPCardProps) {
    return (
            <div className='grid grid-cols-3 md:grid-cols-4'>
                {data?.map((f) => (
                    <Link 
                        key={f.id}
                        href={f.link} 
                        target='_blank'
                        className='group flex flex-col items-center space-y-2 p-3 rounded-2xl'
                    >
                        <div className='relative w-16 h-16 overflow-hidden rounded-2xl'>
                            <Image
                                alt={f.title}
                                src={f.img}    
                                loading='lazy'
                                isBlurred
                            />
                        </div>
                        <h3 className='text-[10px] text-center text-balance'>
                            {f.title}
                        </h3>
                    </Link>
                ))}
            </div>
    )
}
