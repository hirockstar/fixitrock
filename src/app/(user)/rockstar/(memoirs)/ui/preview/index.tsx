'use client'
import { Button, Modal, ModalContent, ModalHeader, Skeleton, User } from '@heroui/react'
import { Dispatch, SetStateAction } from 'react'
import { Download } from 'lucide-react'

import { useMediaQuery } from '®/hooks/useMediaQuery'
import { DriveItem } from '®/types/drive'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '®/ui/drawer'
import { useLocation } from '®hooks/tanstack/query'

import { randomSlang } from '../utils'

import Switch from './switch'

type PreviewProps = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    c: DriveItem
}

function UserInfo({ data, isLoading }: { data?: DriveItem; isLoading: boolean }) {
    const address = data?.location?.address
    const locationText = address
        ? `${address.city}, ${address.locality}, ${address.postalCode}, ${address.state}, ${address.countryOrRegion}`
        : randomSlang()

    return (
        <User
            avatarProps={{ src: '/icons/fixitrock.png' }}
            description={
                <Skeleton
                    className='line-clamp-1 min-w-60 rounded text-xs text-muted-foreground'
                    isLoaded={!isLoading}
                >
                    {locationText}
                </Skeleton>
            }
            name='Rock Star 💕'
        />
    )
}

// function Content({ c }: { c: DriveItem }) {
//     const { data, isLoading } = useLocation(c.id)

//     return (
//         <div className='grid h-full w-full bg-background md:grid-cols-[1fr,380px]'>
//             {/* Mobile Header */}
//             <div className='flex w-full items-center justify-between p-2 py-4 sm:hidden sm:px-4 sm:py-0'>
//                 <UserInfo data={data} isLoading={isLoading} />
//                 <Button isIconOnly radius='full' size='sm' variant='light'>
//                     <MoreHorizontal size={20} />
//                 </Button>
//             </div>

//             {/* Main Content */}
//             <div className='relative flex h-full items-center justify-center overflow-hidden sm:border-r'>
//                 <Switch file={c} />
//             </div>

//             {/* Sidebar (Desktop) */}
//             <div className='flex h-full flex-col'>
//                 <div className='hidden w-full items-center justify-between gap-3 border-b p-2 sm:flex sm:px-4'>
//                     <UserInfo data={data} isLoading={isLoading} />
//                     <Button isIconOnly radius='full' size='sm' variant='light'>
//                         <MoreHorizontal size={20} />
//                     </Button>
//                 </div>

//                 <div className='hidden flex-1 overflow-y-auto sm:block' />

//                 {/* Action Buttons */}
//                 <div className='flex w-full items-center justify-between p-2 sm:border-t sm:px-4'>
//                     {/* <div className='flex gap-2'>
//                         <Button isIconOnly radius='full' variant='light'>
//                             <Heart size={20} />
//                             <span className='sr-only'>Like</span>
//                         </Button>
//                         <Button isIconOnly radius='full' variant='light'>
//                             <MessageCircle size={20} />
//                             <span className='sr-only'>Comment</span>
//                         </Button>
//                         <Button isIconOnly radius='full' variant='light'>
//                             <Download size={20} />
//                             <span className='sr-only'>Share</span>
//                         </Button>
//                     </div>
//                     <Button isIconOnly size='sm' variant='light'>
//                         <Send size={20} />
//                         <span className='sr-only'>Save</span>
//                     </Button> */}
//                 </div>

//                 <div className='flex flex-1 overflow-y-auto p-4 sm:hidden' />
//             </div>
//         </div>
//     )
// }

export function Preview({ open, setOpen, c }: PreviewProps) {
    const isDesktop = useMediaQuery('(min-width: 640px)')
    const { data, isLoading } = useLocation(c.id)

    return (
        <>
            {isDesktop ? (
                <Modal
                    hideCloseButton
                    className='max-w-6xl'
                    isOpen={open}
                    placement='center'
                    scrollBehavior='inside'
                    onOpenChange={setOpen}
                >
                    <ModalContent className='overflow-hidden border dark:bg-black'>
                        <div className='mx-auto flex h-64 flex-col items-center justify-center'>
                            <h1 className='text-2xl font-bold'>
                                Preview on Mobile for better exprience now
                            </h1>
                        </div>
                        <ModalHeader aria-hidden className='hidden' />
                    </ModalContent>
                </Modal>
            ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerContent className='overflow-auto p-2'>
                        <DrawerTitle>
                            <div className='flex w-full items-center justify-between p-2'>
                                <UserInfo data={data} isLoading={isLoading} />
                                <Button
                                    isIconOnly
                                    radius='full'
                                    size='sm'
                                    variant='light'
                                    onPress={() => {
                                        const downloadUrl = c['@microsoft.graph.downloadUrl']

                                        if (downloadUrl) {
                                            const link = document.createElement('a')

                                            link.href = downloadUrl
                                            link.setAttribute(c.name, '')
                                            document.body.appendChild(link)
                                            link.click()
                                            document.body.removeChild(link)
                                        }
                                    }}
                                >
                                    <Download size={20} />
                                </Button>
                            </div>
                        </DrawerTitle>
                        <DrawerDescription aria-hidden />
                        <Switch file={c} />
                    </DrawerContent>
                </Drawer>
            )}
        </>
    )
}
