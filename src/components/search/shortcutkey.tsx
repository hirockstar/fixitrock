'use client'

import { Tooltip, Button } from '@heroui/react'
import { ArrowDown, ArrowRightToLine, ArrowUp, CornerDownLeft } from 'lucide-react'
import React from 'react'

type Icon = {
    tooltip: string
    icon: React.ReactNode
}

type ShortcutProps = {
    tooltip: string
    icon: React.ReactNode
}

const Shortcut: React.FC<ShortcutProps> = ({ tooltip, icon }) => (
    <Tooltip content={tooltip} aria-label={tooltip} showArrow={true}>
        <Button
            aria-label={tooltip}
            size='sm'
            className='h-6 w-6 min-w-0 rounded-sm border bg-default/10 dark:bg-default/30'
            variant='light'
            isIconOnly
        >
            {icon}
        </Button>
    </Tooltip>
)

const icons: Icon[] = [
    { tooltip: 'Tab → Next List', icon: <ArrowRightToLine size={16} /> },
    { tooltip: '↑ Move Up', icon: <ArrowUp size={16} /> },
    { tooltip: '↓ Move Down', icon: <ArrowDown size={16} /> },
    { tooltip: 'Enter → Open Item', icon: <CornerDownLeft size={16} /> },
]

export default function ShortcutKey() {
    return (
        <div className='flex select-none items-center gap-2'>
            <h3 className='text-sm text-muted-foreground'>Shortcut Key</h3>
            <div className='flex gap-2'>
                {icons.map(({ tooltip, icon }, index) => (
                    <Shortcut key={index} tooltip={tooltip} icon={icon} />
                ))}
            </div>
        </div>
    )
}
