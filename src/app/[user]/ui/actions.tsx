'use client'
import React from 'react'
import { Button, Tooltip } from '@heroui/react'
import { Plus, UserPlus } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

import { User } from '®app/login/types'
import { useDevice, usePwa } from '®hooks'

interface ActionsProps {
    onFollow: () => void
    onMessage: () => void
    isFollowing: boolean
    canManage: boolean
    user: User
}

export function Actions({ onFollow, onMessage, isFollowing, canManage, user }: ActionsProps) {
    const { installPWA, isInstallable } = usePwa(user.role)
    const { icon } = useDevice()

    return (
        <div className='flex gap-4'>
            {isInstallable && (
                <Tooltip isOpen content='Tap to Install Our App'>
                    <Button
                        isIconOnly
                        className='h-[34px] rounded-lg'
                        startContent={icon}
                        onPress={installPWA}
                    />
                </Tooltip>
            )}
            <Button
                className='h-[34px] w-full rounded-lg bg-green-500 text-white'
                startContent={<FaWhatsapp className='shrink-0' size={20} />}
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
                    className='h-[34px] w-full rounded-lg'
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
