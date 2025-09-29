'use client'

import React, { useState } from 'react'
import { Button, Checkbox } from '@heroui/react'
import { ArrowLeft, SearchIcon, Tag, Building, Info, ArrowRightIcon } from 'lucide-react'

import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from '@/ui/command'
import { FilterIcon } from '@/ui/icons'
import { useProductFilterStore } from '@/zustand/filter'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { Drawer, DrawerContent, DrawerTrigger } from '@/ui/drawer'

type StatusOption = { key: string; label: string }

type FilterProps = {
    categories: string[]
    brands: string[]
    statusOptions: StatusOption[]
}

type Section = 'root' | 'category' | 'brand' | 'status'

export function Filter(props: FilterProps) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery('(min-width: 768px)')

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        className='min-w-fit rounded-sm border'
                        size='sm'
                        startContent={<FilterIcon className='size-4' />}
                        variant='light'
                    >
                        Filter
                    </Button>
                </PopoverTrigger>
                <PopoverContent align='end' className='w-60 overflow-hidden p-0'>
                    <Content {...props} />
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    className='min-w-fit rounded-sm border'
                    size='sm'
                    startContent={<FilterIcon className='size-4' />}
                    variant='light'
                >
                    Filter
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <Content {...props} />
            </DrawerContent>
        </Drawer>
    )
}

function Content({ categories, brands, statusOptions }: FilterProps) {
    const [section, setSection] = useState<Section>('root')
    const { values, toggleCategory, toggleBrand, toggleStatus } = useProductFilterStore()

    const placeholder =
        section === 'root'
            ? 'Search filters . . .'
            : section === 'category'
              ? 'Select categories . . .'
              : section === 'brand'
                ? 'Select brands . . .'
                : 'Select status . . .'

    const rootItems = [
        { key: 'brand' as const, label: 'Brands', icon: <Building className='size-4' /> },
        { key: 'category' as const, label: 'Categories', icon: <Tag className='size-4' /> },
        { key: 'status' as const, label: 'Status', icon: <Info className='size-4' /> },
    ]

    const showBack = section !== 'root'

    return (
        <Command className='sm:max-h-80'>
            <CommandInput
                className='h-9 border-b'
                placeholder={placeholder}
                startContent={
                    <Button
                        isIconOnly
                        className={showBack ? 'bg-default/20' : 'data-[hover=true]:bg-transparent'}
                        radius='full'
                        size='sm'
                        startContent={showBack ? <ArrowLeft size={16} /> : <SearchIcon size={16} />}
                        variant={showBack ? 'flat' : 'light'}
                        onPress={() => showBack && setSection('root')}
                    />
                }
            />

            <CommandList>
                {section === 'root' && (
                    <CommandGroup heading='Filter by'>
                        {rootItems.map((it) => (
                            <CommandItem
                                key={it.key}
                                className='group'
                                onSelect={() => setSection(it.key)}
                            >
                                <div className='flex items-center gap-2'>
                                    {it.icon}
                                    {it.label}
                                </div>
                                <CommandShortcut>
                                    <ArrowRightIcon className='size-4 opacity-0 group-aria-selected:opacity-100' />
                                </CommandShortcut>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {section === 'category' && (
                    <CommandGroup heading='Category'>
                        {categories
                            .filter((c) => c !== 'all')
                            .map((cat) => {
                                const checked = values.categories.includes(cat)

                                return (
                                    <CommandItem key={cat} onSelect={() => toggleCategory(cat)}>
                                        <Checkbox
                                            isSelected={checked}
                                            size='sm'
                                            onValueChange={() => toggleCategory(cat)}
                                        />
                                        {cat}
                                    </CommandItem>
                                )
                            })}
                    </CommandGroup>
                )}

                {section === 'brand' && (
                    <CommandGroup heading='Brand'>
                        {brands
                            .filter((b) => b !== 'all')
                            .map((b) => {
                                const checked = values.brands.includes(b)

                                return (
                                    <CommandItem key={b} onSelect={() => toggleBrand(b)}>
                                        <Checkbox
                                            isSelected={checked}
                                            size='sm'
                                            onValueChange={() => toggleBrand(b)}
                                        />
                                        {b}
                                    </CommandItem>
                                )
                            })}
                    </CommandGroup>
                )}

                {section === 'status' && (
                    <CommandGroup heading='Status'>
                        {statusOptions.map((s) => {
                            const checked = values.status.includes(s.key)

                            return (
                                <CommandItem key={s.key} onSelect={() => toggleStatus(s.key)}>
                                    <Checkbox
                                        isSelected={checked}
                                        size='sm'
                                        onValueChange={() => toggleStatus(s.key)}
                                    />
                                    {s.label}
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                )}
            </CommandList>
        </Command>
    )
}
