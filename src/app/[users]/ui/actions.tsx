'use client'
import React from 'react'
import { Button } from '@heroui/react'
import { Plus, UserPlus } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

interface ActionsProps {
    onFollow: () => void
    onMessage: () => void
    isFollowing: boolean
}

export function Actions({ onFollow, onMessage, isFollowing }: ActionsProps) {
    return (
        <div className='flex min-w-[300px] gap-3'>
            <Button
                className='w-full rounded-lg bg-green-500 text-white'
                startContent={<FaWhatsapp size={20} />}
                onPress={onMessage}
            >
                WhatsApp
            </Button>
            <Button
                className='w-full rounded-lg'
                color='primary'
                startContent={isFollowing ? <UserPlus size={20} /> : <Plus size={20} />}
                onPress={onFollow}
            >
                {isFollowing ? 'Following' : 'Follow'}
            </Button>
        </div>
    )
}
