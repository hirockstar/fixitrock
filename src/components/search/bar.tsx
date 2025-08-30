'use client'
import { ArrowLeft, SearchIcon, X } from 'lucide-react'
import { Button } from '@heroui/react'
import React from 'react'
import { CommandLoading } from 'cmdk'

import { Navigation, User as UserType } from '@/app/login/types'
import AnimatedSearch, { useOpen } from '@/ui/farmer/search'
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
    CommandGroup,
} from '@/ui/search'
import { getSearchPlaceholder } from '@/lib/utils'
import { Icon } from '@/lib'
import { CommandType, Navigations } from '@/config/navigation'
import { Download } from '@/app/(space)/ui/download'

export function SearchBar({
    user,
    navigation,
    children,
}: {
    user: UserType | null
    navigation: Navigation[]
    children: React.ReactNode
}) {
    const { open, setOpen } = useOpen()
    const [stack, setStack] = React.useState<CommandType[][]>([Object.values(Navigations).flat()])
    const [query, setQuery] = React.useState('')

    const currentItems = stack[stack.length - 1]

    const allItems = [...Object.values(Navigations).flat()]

    const findParentItem = () => {
        if (stack.length === 1) return null

        const currentStackItems = stack[stack.length - 1]

        return allItems.find((item) =>
            currentStackItems.some((stackItem) => stackItem.id === item.id)
        )
    }

    const parentItem = findParentItem()

    let itemsToRender: CommandType[] = currentItems
    let sectionLoading = false

    if (query.trim() && !parentItem) {
        const searchableItems = allItems.flatMap((section) =>
            section.children ? [section, ...section.children] : [section]
        )

        const filteredItems = searchableItems.filter(
            (item) =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.description?.toLowerCase().includes(query.toLowerCase())
        )

        itemsToRender = filteredItems
        sectionLoading = false
    } else if (parentItem?.searchHook) {
        const { data, isLoading } = parentItem.searchHook(query)

        itemsToRender = query ? data : (parentItem.children ?? [])
        sectionLoading = isLoading
    } else if (parentItem?.children) {
        itemsToRender = parentItem.children
    }

    // console.log('Search Debug:', {
    //     query,
    //     parentItem: parentItem?.title,
    // })
    function handleSelect(item: CommandType) {
        if (item.children || item.searchHook) {
            // entering section
            const children = item.children ?? []

            setStack((prev) => [...prev, children])
        } else if (item.onSelect) {
            item.onSelect()
            setOpen(false)
        }
    }

    function handleBack() {
        if (stack.length > 1) {
            setStack((prev) => prev.slice(0, -1))
            setQuery('')
        }
    }

    return (
        <AnimatedSearch open={open} setOpen={setOpen}>
            <Command
                className={`${open ? 'h-[80dvh] rounded-b-none md:h-[60dvh] md:rounded-lg md:border' : 'border'}`}
            >
                {open && (
                    <CommandList>
                        {sectionLoading && <CommandLoading>Loading...</CommandLoading>}
                        <CommandEmpty>No results found.</CommandEmpty>

                        {stack.length === 1 &&
                            Object.entries(Navigations).map(([groupName, items]) => (
                                <CommandGroup
                                    key={groupName}
                                    heading={groupName.charAt(0).toUpperCase() + groupName.slice(1)}
                                >
                                    {items.map((item) => (
                                        <CommandItem
                                            key={item.id}
                                            description={item.description}
                                            startContent={<Icon icon={item.icon} />}
                                            title={item.title}
                                            value={item.title}
                                            onSelect={() => handleSelect(item)}
                                        />
                                    ))}
                                </CommandGroup>
                            ))}
                        <CommandGroup>
                            {!sectionLoading &&
                                stack.length > 1 &&
                                itemsToRender.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        description={item.description}
                                        startContent={<Icon icon={item.icon} />}
                                        title={item.title}
                                        value={item.title}
                                        onSelect={() => handleSelect(item)}
                                    />
                                ))}
                        </CommandGroup>
                    </CommandList>
                )}
                <CommandInput
                    classNames={{ base: `${open ? 'sticky bottom-0 border-y' : ''}` }}
                    endContent={
                        <>
                            <Download />
                            {query ? (
                                <Button
                                    isIconOnly
                                    className='bg-default/20'
                                    radius='full'
                                    size='sm'
                                    startContent={<X size={18} />}
                                    variant='light'
                                    onPress={() => setQuery('')}
                                />
                            ) : (
                                children
                            )}
                        </>
                    }
                    placeholder={getSearchPlaceholder(user?.name)}
                    startContent={
                        <Button
                            isIconOnly
                            className={stack.length === 1 ? '' : 'bg-default/20'}
                            radius='full'
                            size='sm'
                            startContent={
                                stack.length === 1 ? (
                                    <SearchIcon size={18} />
                                ) : (
                                    <ArrowLeft size={18} />
                                )
                            }
                            variant={stack.length === 1 ? 'light' : 'flat'}
                            onPress={stack.length === 1 ? () => '' : handleBack}
                        />
                    }
                    value={query}
                    onFocus={() => setOpen(true)}
                    onValueChange={setQuery}
                />
            </Command>
        </AnimatedSearch>
    )
}
