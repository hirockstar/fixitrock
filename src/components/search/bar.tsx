'use client'
import { Button, Image, Input } from '@heroui/react'
import { Search, X } from 'lucide-react'
import { useState } from 'react'

import { useSearch } from '®tanstack/query'
import AnimatedSearch, { useOpen } from '®ui/farmer/search'
import { UserSheet } from '®app/[user]/ui'
import { Navigation, User } from '®app/login/types'

import { DriveItem } from './drive-item'
import ShortcutKey from './shortcutkey'
import { Suggestion } from './suggestion'

export function SearchBar({ user, navigation }: { user: User | null; navigation: Navigation[] }) {
    const [query, setQuery] = useState('')
    const { data, isLoading } = useSearch(query)
    const { open, setOpen } = useOpen()

    return (
        <AnimatedSearch open={open} setOpen={setOpen}>
            <div
                className={`${open ? 'bg-background flex h-full flex-col rounded-xl sm:h-[60dvh] sm:border' : ''} overflow-hidden`}
            >
                <Input
                    classNames={{
                        inputWrapper: `bg-background/80 data-[hover=true]:bg-background/80 group-data-[focus=true]:bg-background/80 h-11 min-h-10 overflow-hidden shadow-none backdrop-blur ${
                            open
                                ? 'rounded-none border-b p-2 px-2.5!'
                                : 'overflow-hidden rounded-xl border'
                        }`,
                        mainWrapper: 'overflow-hidden',
                    }}
                    endContent={
                        query ? (
                            <Button
                                isIconOnly
                                className='data-hover:bg-foreground/10'
                                radius='full'
                                size='sm'
                                variant='light'
                                onPress={() => setQuery('')}
                            >
                                <X size={18} />
                            </Button>
                        ) : (
                            <UserSheet navigation={navigation} user={user} />
                        )
                    }
                    placeholder={user ? `Hi ${user.name}` : 'Work in progress . . . '}
                    size='lg'
                    startContent={<Search size={20} />}
                    type='text'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setOpen(true)}
                />

                {open && (
                    <div className='flex-1 overflow-y-auto'>
                        {!query && <Suggestion navigation={navigation} setOpen={setOpen} />}
                        {query && (
                            <DriveItem
                                data={data}
                                isLoading={isLoading}
                                query={query}
                                setOpen={setOpen}
                            />
                        )}
                    </div>
                )}

                {open && (
                    <div className='sticky bottom-0 hidden items-center justify-between border-t p-1.5 select-none lg:flex'>
                        <Image
                            alt='Fix iT Rock'
                            height={30}
                            src='/icons/fixitrock.png'
                            width={30}
                        />
                        <ShortcutKey />
                    </div>
                )}
            </div>
        </AnimatedSearch>
    )
}
