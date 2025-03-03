'use client'

import { Image } from '@heroui/react'
import React from 'react'

import { useProfile } from '®/hooks/useProfile'
import { Counts } from '®/lib/utils'
import { UserProps } from '®/types/user'

import { Actions } from './actions'

export default function Profile({ user }: { user: UserProps }) {
    const { data } = useProfile(user.username)
    const [isFollowing, setIsFollowing] = React.useState(false)

    const handleFollow = () => {
        setIsFollowing(!isFollowing)
    }
    const handleMessage = () => {
        window.open('https://wa.me/919927241144', '_blank')
    }

    return (
        <div>
            <div className="h-40 rounded-b-lg bg-[url('https://wallpapers.com/images/hd/1920x1080-hd-bikes-honda-cbr-600rr-ax9lzmee34hpenim.jpg')] bg-cover bg-center lg:h-[220px]">
                <Image
                    disableSkeleton
                    alt={`${user.name} cover`}
                    className='h-40 w-full rounded-b-lg object-cover lg:h-[240px]'
                    radius='none'
                    src={data?.user.cover}
                />
            </div>
            <div className='absolute top-20 z-10 flex w-full px-[5%] sm:relative sm:-top-8 lg:px-[10%]'>
                <div className='flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between'>
                    <div className='flex flex-col items-center gap-4 sm:flex-row'>
                        <Image
                            isBlurred
                            alt={`${user.name} avatar`}
                            className='size-36'
                            classNames={{
                                wrapper:
                                    'size-36 rounded-full bg-default/20 object-cover text-2xl backdrop-blur dark:bg-default/40 sm:rounded-lg',
                            }}
                            src={data?.user.avatar}
                        />
                        <div className='flex flex-col items-center sm:items-start md:mt-5 lg:mt-10'>
                            <h1 className='font-serif text-2xl font-bold'>{user.name}</h1>
                            <span className='flex gap-1 text-xs text-muted-foreground lg:text-sm'>
                                <p className='flex items-center gap-1'>
                                    Followers
                                    <span className='text-default-foreground'>
                                        {Counts(user.followers)}
                                    </span>
                                </p>
                                |
                                <p className='flex items-center gap-1'>
                                    Following
                                    <span className='text-default-foreground'>
                                        {Counts(user.following)}
                                    </span>
                                </p>
                            </span>
                        </div>
                    </div>
                    <Actions
                        isFollowing={isFollowing}
                        onFollow={handleFollow}
                        onMessage={handleMessage}
                    />
                </div>
            </div>
        </div>
    )
}
