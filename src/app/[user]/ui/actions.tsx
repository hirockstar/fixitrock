'use client'
import React from 'react'
import { Button } from '@heroui/react'
import { Plus, UserPlus } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

import { User } from '®app/login/types'
import { PWAInstall } from '®components/PWAInstall'

interface ActionsProps {
    onFollow: () => void
    onMessage: () => void
    isFollowing: boolean
    canManage: boolean
    user: User
}

export function Actions({ onFollow, onMessage, isFollowing, canManage, user }: ActionsProps) {
    return (
        <div className='flex flex-col gap-4 md:flex-row'>
            <PWAInstall user={user} />
            <Button
                className='h-[34px] rounded-lg bg-green-500 text-white'
                startContent={<FaWhatsapp size={20} />}
                onPress={onMessage}
            >
                WhatsApp
            </Button>
            {canManage ? (
                <Button
                    className='h-[34px] rounded-lg'
                    color='primary'
                    startContent={<UserPlus size={20} />}
                    onPress={onFollow}
                >
                    Edit
                </Button>
            ) : (
                <Button
                    className='h-[34px] rounded-lg'
                    color='primary'
                    startContent={isFollowing ? <UserPlus size={20} /> : <Plus size={20} />}
                    onPress={onFollow}
                >
                    {isFollowing ? 'Following' : 'Follow'}
                </Button>
            )}
        </div>
    )
}
