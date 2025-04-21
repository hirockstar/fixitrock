'use client'

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react'
import { Target } from 'lucide-react'
import React from 'react'

export type StockFilter = 'all' | 'available' | 'low' | 'out-of-stock'

type StockDropdownProps = {
    selected: StockFilter
    onChange: (val: StockFilter) => void
}

export default function StockDropdown({ selected, onChange }: StockDropdownProps) {
    const getIcon = (status: StockFilter) => {
        switch (status) {
            case 'available':
                return '✅'
            case 'low':
                return '🟡'
            case 'out-of-stock':
                return '❌'
            default:
                return <Target className='text-muted-foreground' size={16} />
        }
    }

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
                    startContent={<p className='text-sm'>{getIcon(selected)}</p>}
                    variant='light'
                />
            </DropdownTrigger>

            <DropdownMenu
                disallowEmptySelection
                aria-label='Stock Filter'
                selectedKeys={new Set([selected])}
                selectionMode='single'
                onSelectionChange={(keys) => {
                    const [val] = Array.from(keys)

                    onChange(val as StockFilter)
                }}
            >
                <DropdownItem key='all'>All</DropdownItem>
                <DropdownItem key='available'>Available</DropdownItem>
                <DropdownItem key='low'>Low</DropdownItem>
                <DropdownItem key='out-of-stock'>Out of Stock</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
