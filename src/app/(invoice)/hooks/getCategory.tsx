import type { ElementType, JSX } from 'react'

import { RiFolderUnknowFill } from 'react-icons/ri'
import { FaBatteryFull } from 'react-icons/fa'
import { FaMobileScreen } from 'react-icons/fa6'

export type CategoryIconComponent = ElementType

export const CategoryIcons: Record<string, CategoryIconComponent> = {
    Folders: FaMobileScreen,
    Battery: FaBatteryFull,
}

export function getCategoryIcon(category: string): JSX.Element {
    const Icon = CategoryIcons[category] || RiFolderUnknowFill

    return <Icon className='mx-auto h-5 w-5 text-muted-foreground' />
}
