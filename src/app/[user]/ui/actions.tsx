'use client'
import React from 'react'
import { Button, Tooltip } from '@heroui/react'
import { Check, Plus, Settings } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import Link from 'next/link'

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
        <div className='flex items-start gap-3'>
            {isInstallable && (
                <Tooltip isOpen content='Tap to Install Our App'>
                    <Button
                        isIconOnly
                        radius='full'
                        size='sm'
                        startContent={icon}
                        onPress={installPWA}
                    />
                </Tooltip>
            )}
            <Tooltip className='bg-green-500 text-white' content='Message on WhatsApp'>
                <Button
                    isIconOnly
                    className='bg-green-500 text-white'
                    radius='full'
                    size='sm'
                    startContent={<FaWhatsapp className='shrink-0' size={20} />}
                    onPress={onMessage}
                />
            </Tooltip>
            {canManage ? (
                <Button
                    passHref
                    as={Link}
                    className={`h-[32px] w-full rounded-full`}
                    color='primary'
                    href={`@${user.username}/settings`}
                    startContent={<Settings size={20} />}
                >
                    Edit
                </Button>
            ) : (
                <Button
                    className={`h-[34px] w-full rounded-full ${isFollowing ? 'bg-muted/50 border-1' : 'bg-blue-500 text-white'}`}
                    startContent={isFollowing ? <Check size={20} /> : <Plus size={20} />}
                    onPress={onFollow}
                >
                    {isFollowing ? 'Following' : 'Follow'}
                </Button>
            )}
        </div>
    )
}
