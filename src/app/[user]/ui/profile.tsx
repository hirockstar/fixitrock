'use client'

import { Button, Image } from '@heroui/react'
import React from 'react'
import { ArrowLeft, Calendar, MapPin, Share } from 'lucide-react'
import Link from 'next/link'

import { User } from '®app/login/types'
import { formatDateTime } from '®lib/utils'
import { Verified } from '®ui/icons'

import { Actions } from './actions'
type ProfileProps = {
    user: User
    canManage: boolean
}
export default function Profile({ user, canManage }: ProfileProps) {
    const [isFollowing, setIsFollowing] = React.useState(false)
    const handleFollow = () => setIsFollowing(!isFollowing)
    const handleMessage = () =>
        window.open(
            `https://api.whatsapp.com/send/?phone=${user.phone.replace(/^\+/, '')}`,
            '_blank'
        )

    return (
        <>
            <>
                <Image
                    disableSkeleton
                    alt={`${user.name} cover`}
                    className='h-30 w-full rounded-none object-cover lg:h-[240px]'
                    radius='none'
                    src={user.cover || '/fallback/cover.png'}
                />
                <div className='absolute top-0 z-10 flex w-full justify-between p-2 md:hidden'>
                    <Button
                        isIconOnly
                        className='text-white'
                        radius='full'
                        size='sm'
                        startContent={<ArrowLeft size={20} />}
                        variant='light'
                    />
                    <Button
                        isIconOnly
                        className='text-white'
                        radius='full'
                        size='sm'
                        startContent={<Share size={20} />}
                        variant='light'
                    />
                </div>
            </>
            <div className='relative z-10 flex w-full flex-col px-[5%] md:flex-row md:gap-4 lg:px-[10%]'>
                <div className='relative -top-20 w-fit shrink-0 md:-top-16'>
                    <Image
                        isBlurred
                        alt={`${user.name} avatar`}
                        className='size-32 md:size-36'
                        classNames={{
                            wrapper:
                                'bg-default/20 dark:bg-default/40 size-32 overflow-hidden rounded-full object-cover text-2xl backdrop-blur md:size-36 md:rounded-lg',
                        }}
                        src={
                            user.avatar ||
                            (user.gender === 'female'
                                ? '/fallback/girl.png'
                                : user.gender === 'other'
                                  ? '/fallback/other.png'
                                  : '/fallback/boy.png')
                        }
                    />

                    {/* <div className='absolute right-2 bottom-2 md:right-0 md:bottom-0'>
                        online icon
                    </div> */}
                </div>
                <div className='relative -top-16 flex w-full flex-col gap-4 md:-top-10 md:flex-row md:items-center md:justify-between'>
                    <div className='flex flex-col gap-1.5'>
                        <h1 className='flex items-center gap-2 text-3xl font-bold'>
                            {user.name} {user.verified && <Verified />}
                        </h1>
                        <p className='text-muted-foreground md:hidden'>@{user.username}</p>
                        <p className='text-muted-foreground max-w-2xl'>{user.bio}</p>
                        <div className='text-muted-foreground flex flex-wrap items-center gap-4 text-sm md:hidden'>
                            {user.location && (
                                <Link
                                    passHref
                                    className='flex items-center gap-1'
                                    href={`https://www.google.com/maps/search/?api=1&query=${user.location}`}
                                    target='blank'
                                >
                                    <MapPin className='h-4 w-4' />
                                    {user.location}
                                </Link>
                            )}
                            <div className='flex items-center gap-1'>
                                <Calendar className='h-4 w-4' />
                                Joined {formatDateTime(user.created_at)}
                            </div>
                        </div>
                    </div>
                    <Actions
                        canManage={canManage}
                        isFollowing={isFollowing}
                        user={user}
                        onFollow={handleFollow}
                        onMessage={handleMessage}
                    />
                </div>
            </div>
        </>
    )
}
