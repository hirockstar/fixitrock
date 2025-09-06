'use client'
import { useTheme } from 'next-themes'
import React from 'react'
import { Button } from '@heroui/react'
import { ArrowLeft, SearchIcon, X } from 'lucide-react'

import { User as UserType } from '@/app/login/types'
import AnimatedSearch from '@/ui/farmer/search'
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
    CommandGroup,
    CommandEmpty,
    CommandSeparator,
} from '@/ui/search'
import { getSearchPlaceholder, capitalize } from '@/lib/utils'
import { Icon } from '@/lib'
import { Navigations, Actions, CommandType } from '@/config/navigation'
import { Download } from '@/app/(space)/ui/download'
import { useSearchBar } from '@/zustand/store'

export function SearchBar({
    user,
    command,
    children,
}: {
    user: UserType | null
    command: Record<string, CommandType[]> | null
    children: React.ReactNode
}) {
    const { setTheme } = useTheme()
    const ref = React.useRef<HTMLDivElement | null>(null)
    const {
        bounce,
        popPage,
        query,
        setQuery,
        pages,
        setPages,
        setDynamicNavigations,
        getNavigationGroups,
        isPageMode,
        open,
        setOpen,
        handleSelect,
        heading,
    } = useSearchBar()

    const actions: Actions = {
        setTheme,
        setPages,
    }

    React.useEffect(() => {
        setDynamicNavigations({ ...command,...Navigations(actions)})
    }, [setDynamicNavigations])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            bounce(ref)
        }

        if (e.key === 'Backspace') {
            if (query.length) {
                return
            }
            e.preventDefault()
            popPage()
            bounce(ref)
        }
    }

    return (
        <AnimatedSearch open={open} setOpen={setOpen}>
            <Command
                ref={ref}
                className={`${open ? 'h-[80dvh] rounded-b-none md:h-[50dvh] md:rounded-lg md:border' : 'border'}`}
                onKeyDown={handleKeyDown}
            >
                {open && (
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                         {/* {command && Object.entries(command).map(([groupName, items]) => (
                            <React.Fragment key={groupName}>
                                <CommandGroup heading={capitalize(groupName)}>
                                    {items.map((n) => (
                                        <CommandItem
                                            key={n.id}
                                            description={n.description}
                                            href={n.href}
                                            startContent={<Icon icon={n.icon} className='size-5' />}
                                       
                                            title={n.title}
                                            value={n.title + n.description}
                                            onSelect={() => handleSelect(n, ref)}
                                        />
                                    ))}
                                </CommandGroup>
                               <CommandSeparator />
                            </React.Fragment>
                        ))} */}
                        
                        {getNavigationGroups().map((group, index) => (
                            <React.Fragment key={group.heading}>
                                {index > 0 && <CommandSeparator />}
                                <CommandGroup heading={capitalize(group.heading)}>
                                    {group.navigationItems.map((n) => (
                                        <CommandItem
                                            key={n.id}
                                            description={n.description}
                                            href={n.href}
                                            startContent={<Icon icon={n.icon} className='size-5' />}
                                       
                                            title={n.title}
                                            value={n.title + n.description}
                                            onSelect={() => handleSelect(n, ref)}
                                        />
                                    ))}
                                </CommandGroup>
                            </React.Fragment>
                        ))}
                        

                      
                    </CommandList>
                )}
                <CommandInput
                    classNames={{ base: `${open ? 'border-y md:border-t md:border-b-0' : ''}` }}
                    endContent={
                        <>
                            <Download />
                            {query ? (
                                <Button
                                    isIconOnly
                                    className='bg-default/20 size-6.5 min-w-0'
                                    radius='full'
                                    size='sm'
                                    startContent={<X size={16} />}
                                    variant='light'
                                    onPress={() => setQuery('')}
                                />
                            ) : (
                                children
                            )}
                        </>
                    }
                    placeholder={ heading() || getSearchPlaceholder(user?.name)}
                    startContent={
                        <Button
                            isIconOnly
                            className={`${pages ? 'bg-default/20' : ''} size-6.5 min-w-0`}
                            radius='full'
                            size='sm'
                            startContent={
                                pages ? <ArrowLeft size={16} /> : <SearchIcon size={16} />
                            }
                            variant={pages ? 'flat' : 'light'}
                            onPress={() => {
                                if (isPageMode()) {
                                    popPage()
                                    bounce(ref)
                                }
                            }}
                        />
                    }
                    value={query}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    onValueChange={(value) => {
                        setQuery(value)
                    }}
                />
            </Command>
        </AnimatedSearch>
    )
}
