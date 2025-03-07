import React from 'react'
import { Button } from '@heroui/react'
import { MessageCircle, User, UserPlus } from 'lucide-react'

interface ActionsProps {
    onFollow: () => void
    onMessage: () => void
    isFollowing: boolean
}

export function Actions({ onFollow, onMessage, isFollowing }: ActionsProps) {
    return (
        <div className='flex gap-4 sm:mt-10'>
            <Button
                className='h-[34px] rounded-lg border bg-background/30 backdrop-blur data-[hover=true]:bg-muted/50'
                startContent={isFollowing ? <UserPlus size={20} /> : <User size={20} />}
                onPress={onFollow}
            >
                {isFollowing ? 'Following' : 'Follow'}
            </Button>
            <Button
                className='h-[34px] rounded-lg border bg-background/30 backdrop-blur data-[hover=true]:bg-muted/50'
                startContent={<MessageCircle size={20} />}
                onPress={onMessage}
            >
                Message
            </Button>
        </div>
    )
}
