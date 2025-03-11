'use client'

import {
    Button,
    Card,
    CardBody,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Skeleton,
} from '@heroui/react'
import { FolderIcon, Gamepad2, HardDrive } from 'lucide-react'
import { motion } from 'motion/react'
import React from 'react'
import { FaApple } from 'react-icons/fa'
import { TbApps } from 'react-icons/tb'
import { useRouter } from 'nextjs-toploader/app'

import { useMediaQuery } from '®/hooks/useMediaQuery'
import { formatBytes, stateColors } from '®/lib/utils'
import { FolderType, StorageType } from '®actions/drive/storage'
import { useStorage } from '®tanstack/query'

import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from './drawer'

export function Status() {
    const { data, isLoading } = useStorage()
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery('(min-width: 640px)')

    if (isLoading || !data) {
        return <Skeleton className='h-6 w-20 rounded-sm' isLoaded={!isLoading} />
    }

    const { storage, folders } = data
    const stateClass = `size-1.5 rounded-full ${stateColors[storage.state]}`
    const stateLabel = `${storage.state.charAt(0).toUpperCase()}${storage.state.slice(1)}`

    const Content = ({ setOpen }: { setOpen: (open: boolean) => void }) => (
        <>
            <Drive data={storage} />
            {folders.map((folder) => (
                <Folder key={folder.name} folder={folder} setOpen={setOpen} />
            ))}
        </>
    )
    const TriggerButton = (
        <Button
            className={`h-8 rounded-sm p-1 text-xs r${stateColors[storage.state]}`}
            startContent={<span aria-hidden='true' className={stateClass} />}
            variant='light'
        >
            {stateLabel}
        </Button>
    )

    return (
        <>
            {isDesktop ? (
                <Popover isOpen={open} onOpenChange={setOpen}>
                    <PopoverTrigger>{TriggerButton}</PopoverTrigger>
                    <PopoverContent className='inline-block w-[300px] space-y-2 border p-1 shadow-none'>
                        <Content setOpen={setOpen} />
                    </PopoverContent>
                </Popover>
            ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
                    <DrawerContent className='mb-8 space-y-2 p-2'>
                        <DrawerTitle aria-hidden />
                        <DrawerDescription aria-hidden />
                        <Content setOpen={setOpen} />
                    </DrawerContent>
                </Drawer>
            )}
        </>
    )
}

function Drive({ data }: { data: StorageType }) {
    const usedSpace = data.total - data.remaining
    const usedPercentage = (usedSpace / data.total) * 100

    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='group'
            initial={{ opacity: 0, y: 20 }}
        >
            <Card
                disableRipple
                fullWidth
                isHoverable
                isPressable
                className='border bg-transparent hover:bg-muted/30 dark:hover:bg-[#0a0a0a]'
                shadow='none'
            >
                <CardBody className='flex-row items-center gap-2.5'>
                    <HardDrive className='size-8 shrink-0' />
                    <div className='w-full space-y-1'>
                        <div className='flex items-center gap-2'>
                            <span className='font-semibold'>Fix iT Rock (C:)</span>
                        </div>
                        <div className='relative h-4 overflow-hidden rounded bg-muted'>
                            <motion.div
                                animate={{ width: `${usedPercentage}%` }}
                                className={`h-full ${stateColors[data.state]}`}
                                initial={{ width: 0 }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                            <div className='absolute inset-0 flex items-center justify-center text-xs font-medium text-white'>
                                {usedPercentage.toFixed(1)}%
                            </div>
                        </div>
                        <p className='flex gap-1 text-xs text-muted-foreground'>
                            {formatBytes(data.remaining)} free of {formatBytes(data.total)}
                        </p>
                    </div>
                </CardBody>
            </Card>
        </motion.div>
    )
}

const folderIcons = {
    Apple: {
        icon: FaApple,
        color: 'bg-gradient-to-r from-green-500 to-teal-400',
        des: 'IPSW & device tools',
    },
    Apps: {
        icon: TbApps,
        color: 'bg-gradient-to-r from-purple-500 to-indigo-400',
        des: 'Apps for all platforms',
    },
    Games: {
        icon: Gamepad2,
        color: 'bg-gradient-to-r from-orange-500 to-yellow-400',
        des: 'Games for all platforms',
    },
}

function Folder({ folder, setOpen }: { folder: FolderType; setOpen: (open: boolean) => void }) {
    const route = useRouter()
    const {
        icon: IconComponent,
        color,
        des,
    } = folderIcons[folder.name as keyof typeof folderIcons] || {
        icon: FolderIcon,
        color: 'gray',
    }

    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='group'
            initial={{ opacity: 0, y: 20 }}
        >
            <Card
                disableRipple
                fullWidth
                isHoverable
                isPressable
                className='border bg-transparent hover:bg-muted/30 dark:hover:bg-[#0a0a0a]'
                shadow='none'
                onPress={() => {
                    setOpen(false)
                    route.push(`/fw/${folder.name}`)
                }}
            >
                <CardBody className='flex-row items-center gap-2.5'>
                    <IconComponent className={`size-8 shrink-0`} />
                    <div className='w-full space-y-0.5'>
                        <div className='flex items-center justify-between'>
                            <span className='font-semibold'>{folder.name}</span>
                            <span className='text-sm text-muted-foreground'>
                                {formatBytes(folder.size)}
                            </span>
                        </div>
                        <div className='relative h-2 overflow-hidden rounded bg-muted'>
                            <motion.div
                                animate={{ width: '100%' }}
                                className={`h-full ${color}`}
                                initial={{ width: 0 }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                        </div>
                        <p className='text-xs text-muted-foreground'>{des}</p>
                    </div>
                </CardBody>
            </Card>
        </motion.div>
    )
}
