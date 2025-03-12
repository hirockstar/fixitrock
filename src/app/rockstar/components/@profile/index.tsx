'use client'

import { Image } from '@heroui/react'
import React from 'react'

import { Counts } from '®lib/utils'
import { useProfile } from '®tanstack/query'

import { Actions } from './actions'

const user = {
    name: 'Rock Star',
    username: 'rockstar',
    bio: 'I am a Rockstar',
    location: 'Mars',
    birthdate: '',
    number: '',
    followers: 0,
    following: 0,
    gender: 'male',
}

export default function Profile() {
    // const { username } = useParams<{ username: string }>()
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
            <Image
                disableSkeleton
                alt={`${user.name} cover`}
                className='h-40 w-full rounded-b-[50px] object-cover lg:h-[240px] lg:rounded-none'
                radius='none'
                src={data?.user.cover}
            />
            <div className='relative -top-20 z-10 flex w-full px-[5%] sm:-top-16 sm:px-[5%] lg:px-[10%]'>
                <div className='flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between'>
                    <div className='flex flex-col items-center sm:flex-row sm:gap-4'>
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
                        <div className='flex flex-col items-center sm:mt-10 sm:items-start'>
                            <h1 className='font-serif text-[36px] font-bold'>{user.name}</h1>
                            <span className='flex gap-1 text-xs text-muted-foreground'>
                                <span className='font-bold text-foreground'>@{user.username}</span>
                                <span>•</span>
                                <span>{Counts(user.followers)} Followers</span>
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
