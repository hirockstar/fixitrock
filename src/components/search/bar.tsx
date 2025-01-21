'use client'
import { Button, Image, Input } from '@heroui/react'
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useSearch } from '®/hooks/useSearch'
import AnimatedSearch, { useOpen } from '®/ui/farmer/search'
import { DriveItem } from './drive-item'
import ShortcutKey from './shortcutkey'
import { Suggestion } from './suggestion'

const SearchBar = () => {
    const [query, setQuery] = useState('')
    const { data, isLoading } = useSearch(query)
    const { open, setOpen } = useOpen()

    return (
        <AnimatedSearch open={open} setOpen={setOpen}>
            <div className={`${open ? 'flex h-full max-h-[70vh] flex-col sm:h-[60dvh]' : ''}`}>
                <div className='sticky top-0'>
                    <Input
                        value={query}
                        type='text'
                        size='lg'
                        placeholder='What do you need?'
                        onFocus={() => setOpen(true)}
                        onChange={(e) => setQuery(e.target.value)}
                        classNames={{
                            inputWrapper: `h-11 min-h-10 bg-background/80 shadow-none backdrop-blur data-[hover=true]:bg-background/80 group-data-[focus=true]:bg-background/80 ${
                                open ? 'rounded-none border-b p-2 !px-2.5' : 'rounded-xl border'
                            }`,
                        }}
                        startContent={<Search size={20} />}
                        endContent={
                            query ? (
                                <Button
                                    isIconOnly
                                    size='sm'
                                    radius='full'
                                    className='data-[hover]:bg-foreground/10'
                                    variant='light'
                                    onPress={() => setQuery('')}
                                >
                                    <X size={18} />
                                </Button>
                            ) : (
                                <Button isIconOnly size='sm' radius='full' variant='flat'>
                                    <Image
                                        src='/icons/rdrive.png'
                                        alt='Fix iT Rock'
                                        width={30}
                                        height={30}
                                    />
                                </Button>
                            )
                        }
                    />
                </div>

                {open && (
                    <div className='flex-1 overflow-y-auto'>
                        {!query && <Suggestion setOpen={setOpen} />}
                        {query && (
                            <DriveItem
                                data={data}
                                isLoading={isLoading}
                                setOpen={setOpen}
                                query={query}
                            />
                        )}
                    </div>
                )}

                {open && (
                    <div className='sticky bottom-0 hidden select-none items-center justify-between border-t p-1.5 lg:flex'>
                        <Image src='/icons/rdrive.png' alt='Fix iT Rock' width={30} height={30} />
                        <ShortcutKey />
                    </div>
                )}
            </div>
        </AnimatedSearch>
    )
}

export default SearchBar
