'use client'

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react'
import { ListFilter } from 'lucide-react'
import React from 'react'

import { getCategoryIcon } from '®app/(invoice)/hooks/getCategory'

type SortDropdownProps = {
    categories: string[]
    selected: string
    onChange: (val: string) => void
}

export default function SortDropdown({ categories, selected, onChange }: SortDropdownProps) {
    return (
        <Dropdown
            className='rounded-lg border shadow-none'
            placement='bottom-end'
            radius='none'
            type='listbox'
        >
            <DropdownTrigger>
                <Button
                    isIconOnly
                    className='h-8 w-8 min-w-0 p-0'
                    radius='full'
                    size='sm'
                    startContent={
                        selected === 'all' ? <ListFilter size={16} /> : getCategoryIcon(selected)
                    }
                    variant='light'
                />
            </DropdownTrigger>

            <DropdownMenu
                disallowEmptySelection
                aria-label='Category Filter'
                selectedKeys={new Set([selected])}
                selectionMode='single'
                onSelectionChange={(keys) => {
                    const [val] = Array.from(keys)

                    onChange(val?.toString() || '')
                }}
            >
                <DropdownItem key='all'>All</DropdownItem>
                <>
                    {categories.map((cat) => (
                        <DropdownItem key={cat} textValue={cat}>
                            {cat}
                        </DropdownItem>
                    ))}
                </>
            </DropdownMenu>
        </Dropdown>
    )
}
