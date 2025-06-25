'use client'
import { Button, Image, ScrollShadow, User, Skeleton } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'

import { useMediaQuery } from '®/hooks/useMediaQuery'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '®/ui/drawer'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '®/ui/sheet'
import NavLinks from '®app/login/ui/navlinks'
import { useUser } from '®provider/user'

type PreviewProps = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function UserSheet() {
    const [open, setOpen] = useState(false)
    const { user, loading, signOut } = useUser()
    const router = useRouter()

    const handlePress = () => {
        if (user) setOpen(true)
        else router.push('/login')
    }

    return (
        <>
            <Button
                isIconOnly
                radius='full'
                size='sm'
                variant={user ? 'flat' : 'light'}
                onPress={handlePress}
            >
                {loading ? (
                    <Skeleton className='size-20 rounded-full' />
                ) : user ? (
                    <Image
                        alt={user.name}
                        height={30}
                        src={
                            user.avatar ||
                            'https://cdn3d.iconscout.com/3d/premium/thumb/boy-7215504-5873316.png'
                        }
                        width={30}
                    />
                ) : (
                    <FaUserCircle aria-label='Login to your account' size={22} />
                )}
            </Button>
            <SheetDrawer open={open} setOpen={setOpen} signOut={signOut} />
        </>
    )
}

const UserDetails = () => {
    const { user } = useUser()

    if (!user) return null

    return (
        <User
            avatarProps={{
                src:
                    user.avatar ||
                    'https://cdn3d.iconscout.com/3d/premium/thumb/boy-7215504-5873316.png',
                fallback: user.name,
                className: 'w-12 h-12',
            }}
            classNames={{
                base: 'flex justify-start px-2 sm:px-0',
                name: 'text-md',
            }}
            description={user.username ? `@${user.username}` : ''}
            name={user.name || 'User'}
        />
    )
}

function SheetDrawer({ open, setOpen, signOut }: PreviewProps & { signOut: () => Promise<void> }) {
    const isDesktop = useMediaQuery('(min-width: 640px)')

    const handleSignOut = async () => {
        setOpen(false)
        await signOut()
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            {isDesktop ? (
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent className='flex flex-col gap-0 p-0 sm:max-w-[280px]'>
                        <SheetHeader aria-label='Profile' className='border-b p-2'>
                            <SheetTitle>
                                <UserDetails />
                            </SheetTitle>
                        </SheetHeader>
                        <ScrollShadow hideScrollBar className='flex-1 lg:pr-3'>
                            <NavLinks onClose={handleClose} />
                        </ScrollShadow>
                        <SheetFooter className='flex flex-col gap-2 border-t p-2'>
                            <Button fullWidth color='danger' onPress={handleSignOut}>
                                Logout
                            </Button>
                            <p className='text-muted-foreground text-start text-xs'>
                                Fix it Rock © 2025
                            </p>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerContent className='p-2'>
                        <DrawerTitle aria-hidden />
                        <DrawerDescription aria-hidden />
                        <div className='w-full space-y-4'>
                            <UserDetails />
                            <NavLinks onClose={handleClose} />
                            <Button fullWidth color='danger' onPress={handleSignOut}>
                                Logout
                            </Button>
                        </div>
                    </DrawerContent>
                </Drawer>
            )}
        </>
    )
}
