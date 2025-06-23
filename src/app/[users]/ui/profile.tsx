'use client'

import { Image } from '@heroui/react'
import React from 'react'

import { User } from '®app/login/types'

import { Actions } from '.'

export default function Profile(user: User) {
    const [isFollowing, setIsFollowing] = React.useState(false)

    const handleFollow = () => {
        setIsFollowing(!isFollowing)
    }
    const handleMessage = () => {
        window.open(`https://wa.me/${user.phone}`, '_blank')
    }

    return (
        <>
            <Image
                disableSkeleton
                alt={`${user.name} cover`}
                className='h-40 w-full rounded-b-[50px] object-cover lg:h-[240px] lg:rounded-none'
                radius='none'
                src={user.avatar_url || undefined}
            />
            <div className='relative -top-20 z-10 flex w-full px-[5%] sm:-top-16 sm:px-[5%] lg:px-[10%]'>
                <div className='flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between'>
                    <div className='flex flex-col items-center sm:flex-row sm:gap-4'>
                        <Image
                            isBlurred
                            isLoading
                            alt={`${user.name} avatar`}
                            className='size-36'
                            classNames={{
                                wrapper:
                                    'bg-default/20 dark:bg-default/40 size-36 rounded-full object-cover text-2xl backdrop-blur sm:rounded-lg',
                            }}
                            src={user.avatar_url || undefined}
                        />
                        <div className='flex flex-col items-center sm:mt-10 sm:items-start'>
                            <h1 className='font-serif text-[36px] font-bold'>{user.name}</h1>
                            <span className='text-muted-foreground flex gap-1 text-xs'>
                                <span className='text-foreground font-bold'>@{user.username}</span>
                                {/* <span>•</span> */}
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
        </>
    )
}
