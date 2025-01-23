'use client'
import { Button, Skeleton, Tooltip } from '@heroui/react'
import { LayoutGrid, LayoutList } from 'lucide-react'

import useLayout from '®/hooks/useLayout'

export default function Layout() {
    const { layout, setLayout, hydrated } = useLayout()

    const toggleLayout = () => {
        setLayout(layout === 'Grid' ? 'List' : 'Grid')
    }

    return (
        <Tooltip content={layout === 'Grid' ? 'Switch to List' : 'Switch to Grid'} showArrow={true}>
            <Button
                isIconOnly
                className='group h-9 min-w-9 rounded-lg border'
                size='sm'
                variant='light'
                onPress={toggleLayout}
            >
                {hydrated ? (
                    layout === 'Grid' ? (
                        <LayoutGrid size={20} />
                    ) : (
                        <LayoutList size={20} />
                    )
                ) : (
                    <Skeleton className='size-5 rounded' />
                )}
            </Button>
        </Tooltip>
    )
}
