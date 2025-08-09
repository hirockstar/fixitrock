'use client'

import { Card, CardBody, CardHeader, Button, CardFooter, User as HeroUser } from '@heroui/react'
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Share } from 'lucide-react'
import { useState } from 'react'

import { QuoteSkeleton } from '®/ui/skeleton'
import { useQuote } from '®tanstack/query'
import { cn, formatDateTime, userAvatar } from '®lib/utils'
import { User } from '®app/login/types'
import { Verified } from '®ui/icons'

interface QuoteCardProps {
    quote: {
        id: number
        quote: string
        username: string
        lastModifiedDateTime: string
        comments?: number
        likes?: number
    }
    user: User
}

function QuoteCard({ quote, user }: QuoteCardProps) {
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)

    const handleLike = () => {
        setIsLiked(!isLiked)
    }

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: `Quote by @${quote.username}`,
                text: quote.quote,
                url: window.location.href,
            })
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`"${quote.quote}" - @${quote.username}`)
        }
    }

    return (
        <Card
            className='group rounded-none border-b bg-transparent p-0 md:rounded-xl md:border'
            shadow='none'
        >
            <CardHeader className='flex w-full justify-between'>
                <HeroUser
                    avatarProps={{
                        src: userAvatar(user),
                        fallback: user.name,
                        className: '',
                    }}
                    classNames={{
                        base: 'flex justify-start px-2 sm:px-0',
                        name: 'flex items-center gap-1 text-sm',
                        description: 'text-muted-foreground text-xs',
                    }}
                    description={`@${user.username} · ${formatDateTime(quote.lastModifiedDateTime)}`}
                    name={
                        <>
                            {user.name}
                            {user.verified && <Verified className='size-5' />}
                        </>
                    }
                />
                <Button
                    isIconOnly
                    className='text-default-400 hover:text-default-600'
                    radius='full'
                    size='sm'
                    variant='light'
                >
                    <MoreHorizontal size={18} />
                </Button>
            </CardHeader>

            <CardBody className='relative h-52'>
                <div className='from-default-50/60 to-default-100/40 border-default-200/50 relative flex h-full items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br'>
                    <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                        <div className='bg-primary/20 absolute top-4 left-6 h-1 w-1 animate-pulse rounded-full' />
                        <div className='bg-secondary/30 absolute top-8 right-8 h-0.5 w-0.5 animate-pulse rounded-full delay-300' />
                        <div className='bg-primary/15 absolute bottom-6 left-8 h-1.5 w-1.5 animate-pulse rounded-full delay-700' />
                    </div>
                    <div className='text-primary/25 absolute top-3 left-4 -rotate-12 transform font-serif text-5xl leading-none transition-all duration-300 select-none'>
                        "
                    </div>
                    <div className='text-primary/25 absolute right-4 bottom-1 rotate-12 transform font-serif text-5xl leading-none transition-all duration-300 select-none'>
                        "
                    </div>

                    <div className='flex h-full w-full items-center justify-center px-6 py-4'>
                        <blockquote className='w-full max-w-full text-center'>
                            <p
                                className={cn(
                                    'text-foreground selection:bg-primary/20 leading-relaxed font-medium tracking-wide italic transition-all duration-300',
                                    quote.quote.length <= 60
                                        ? 'text-lg md:text-xl lg:text-2xl'
                                        : quote.quote.length <= 120
                                          ? 'text-base md:text-lg lg:text-xl'
                                          : 'text-sm md:text-base lg:text-lg'
                                )}
                            >
                                <span
                                    className={cn(
                                        'inline-block transform break-words hyphens-auto transition-transform duration-500 hover:scale-[1.02]',
                                        quote.quote.length <= 60
                                            ? 'line-clamp-2 md:line-clamp-3'
                                            : quote.quote.length <= 120
                                              ? 'line-clamp-3 md:line-clamp-4'
                                              : 'line-clamp-4 md:line-clamp-5 lg:line-clamp-6'
                                    )}
                                >
                                    {quote.quote}
                                </span>
                            </p>

                            <div className='mt-3 opacity-0 transition-opacity duration-500 group-hover:opacity-60'>
                                <div className='via-primary/40 mx-auto h-px w-8 bg-gradient-to-r from-transparent to-transparent' />
                            </div>
                        </blockquote>
                    </div>

                    <div className='from-primary/3 to-secondary/3 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br via-transparent' />

                    <div
                        className={cn(
                            'pointer-events-none absolute right-0 bottom-0 left-0 rounded-b-2xl bg-gradient-to-t',
                            quote.quote.length > 120
                                ? 'from-default-100/70 h-12 to-transparent'
                                : 'from-default-100/40 h-6 to-transparent'
                        )}
                    />
                </div>
            </CardBody>

            <CardFooter className='flex w-full items-center justify-between space-x-2'>
                <Button
                    className='text-default-500 transition-colors duration-200 hover:bg-blue-500/10 hover:text-blue-500'
                    radius='full'
                    size='sm'
                    startContent={<MessageCircle size={18} />}
                    variant='light'
                >
                    <span className='text-sm'>0</span>
                </Button>

                <Button
                    className={cn(
                        'transition-colors duration-200',
                        isLiked
                            ? 'text-red-500 hover:bg-red-500/10 hover:text-red-600'
                            : 'text-default-500 hover:bg-red-500/10 hover:text-red-500'
                    )}
                    radius='full'
                    size='sm'
                    startContent={<Heart className={cn(isLiked && 'fill-current')} size={18} />}
                    variant='light'
                    onPress={handleLike}
                >
                    <span className='text-sm'>0</span>
                </Button>

                <Button
                    className='text-default-500 transition-colors duration-200 hover:bg-green-500/10 hover:text-green-500'
                    radius='full'
                    size='sm'
                    startContent={<Share size={18} />}
                    variant='light'
                    onPress={handleShare}
                />

                <Button
                    className={cn(
                        'transition-colors duration-200',
                        isBookmarked
                            ? 'text-blue-500 hover:bg-blue-500/10 hover:text-blue-600'
                            : 'text-default-500 hover:bg-blue-500/10 hover:text-blue-500'
                    )}
                    radius='full'
                    size='sm'
                    startContent={
                        <Bookmark className={cn(isBookmarked && 'fill-current')} size={18} />
                    }
                    variant='light'
                    onPress={() => setIsBookmarked(!isBookmarked)}
                />
            </CardFooter>
        </Card>
    )
}

export function Quotes({ user }: { user: User }) {
    const { data, isLoading } = useQuote()

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-3 2xl:grid-cols-4'>
            {isLoading ? (
                <QuoteSkeleton />
            ) : (
                <>
                    {data?.map((q) => (
                        <QuoteCard key={q.id} quote={q} user={user} />
                    ))}
                </>
            )}
        </div>
    )
}
