'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@heroui/react'

import { useSearch } from '@tanstack/query'
import { Navigation, User as UserType } from '@/app/login/types'
import AnimatedSearch, { useOpen } from '@/ui/farmer/search'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/ui/search'
import { searchCommandsTheme } from '@/config/search-commands'
import { getSearchPlaceholder } from '@/lib/utils'

export function SearchBar({
    user,
    navigation,
    children,
}: {
    user: UserType | null
    navigation: Navigation[]
    children: React.ReactNode
}) {
    const [query, setQuery] = useState('')
    const { data, isLoading } = useSearch(query)
    const { open, setOpen } = useOpen()

    const renderCommands = () => {
        return Object.entries(searchCommandsTheme).map(([category, subcategories]) => (
            <CommandGroup key={category} heading={category}>
                {Object.entries(subcategories).map(([subcategory, commands]) =>
                    commands.map((command) => (
                        <CommandItem
                            key={command.id}
                            description={command.description}
                            startContent={
                                command.icon || <div className='bg-muted h-4 w-4 rounded' />
                            }
                            title={command.title}
                            value={command.title.toLowerCase()}
                        />
                    ))
                )}
            </CommandGroup>
        ))
    }

    return (
        <AnimatedSearch open={open} setOpen={setOpen}>
            <Command
                className={`${open ? 'h-[80dvh] rounded-b-none md:h-[60dvh] md:rounded-lg md:border' : 'border'}`}
            >
                {open && (
                    <CommandList>
                        <CommandEmpty>No commands found.</CommandEmpty>
                        {renderCommands()}
                    </CommandList>
                )}
                <CommandInput
                    classNames={{ base: `${open ? 'sticky bottom-0 border-y' : ''}` }}
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
                            <div className='flex items-center gap-2'> {children}</div>
                        )
                    }
                    placeholder={getSearchPlaceholder(user?.name)}
                    onClick={() => setOpen(true)}
                />
            </Command>
        </AnimatedSearch>
    )
}
