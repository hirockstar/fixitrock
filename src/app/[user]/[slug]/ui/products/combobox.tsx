'use client'

import * as React from 'react'
import { Input } from '@heroui/react'
import { Check } from 'lucide-react'

import { useMediaQuery } from '@/hooks'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from '@/ui/command'
import { DrawerNested, DrawerContent, DrawerTrigger } from '@/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { cn } from '@/lib/utils'

interface ComboboxProps {
    children: React.ReactNode
    name?: string
    label?: string
    placeholder?: string
    defaultSelectedKey?: string
    width?: string
    buttonClassName?: string
    errorMessage: string
    isInvalid: boolean
}

interface ComboboxItemProps {
    value: string
    children: React.ReactNode
}

const ComboboxContext = React.createContext<{
    selected: string | null
    setSelected: (val: string) => void
    setOpen: (val: boolean) => void
} | null>(null)

export function Combobox({
    children,
    defaultSelectedKey,
    name,
    label,
    placeholder,
    errorMessage,
    isInvalid,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const [selected, setSelected] = React.useState<string | null>(defaultSelectedKey || null)

    const searchPlaceholder = name ? `Search ${name} . . .` : 'Search'

    const triggerButton = (
        <Input
            isReadOnly
            isRequired
            className='cursor-pointer'
            errorMessage={errorMessage}
            isInvalid={isInvalid}
            label={label}
            labelPlacement='outside'
            name={name}
            placeholder={placeholder}
            radius='sm'
            value={selected || ''}
        />
    )

    return (
        <ComboboxContext.Provider value={{ selected, setSelected, setOpen }}>
            {selected && <input name={name} type='hidden' value={selected} />}

            {isDesktop ? (
                <Popover modal open={open} onOpenChange={setOpen}>
                    <PopoverTrigger>{triggerButton}</PopoverTrigger>
                    <PopoverContent className='w-[200px] p-0'>
                        <Content placeholder={searchPlaceholder}>{children}</Content>
                    </PopoverContent>
                </Popover>
            ) : (
                <DrawerNested modal={true} open={open} onOpenChange={setOpen}>
                    <DrawerTrigger>{triggerButton}</DrawerTrigger>
                    <DrawerContent className='bg-background/80 max-h-[30vh] backdrop-blur'>
                        <Content placeholder={searchPlaceholder}>{children}</Content>
                    </DrawerContent>
                </DrawerNested>
            )}
        </ComboboxContext.Provider>
    )
}

function Content({ children, placeholder }: { children: React.ReactNode; placeholder: string }) {
    const ctx = React.useContext(ComboboxContext)

    if (!ctx) return null

    return (
        <Command className='h-[35vh] bg-transparent backdrop-blur-none'>
            <CommandInput className='border-b' placeholder={placeholder} />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>{children}</CommandGroup>
            </CommandList>
        </Command>
    )
}

export function ComboboxItem({ value, children }: ComboboxItemProps) {
    const ctx = React.useContext(ComboboxContext)

    if (!ctx) throw new Error('ComboboxItem must be used within Combobox')

    const { selected, setSelected, setOpen } = ctx

    const handleSelect = () => {
        setSelected(value)
        setOpen(false)
    }

    return (
        <CommandItem key={value} value={value} onSelect={handleSelect}>
            {children}
            <CommandShortcut>
                <Check
                    className={cn(
                        'ml-auto h-4 w-4 transition-opacity',
                        selected === value ? 'opacity-100' : 'opacity-0'
                    )}
                />
            </CommandShortcut>
        </CommandItem>
    )
}
