'use client'

import { Button, Image, ScrollShadow, User as HeroUser } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'

import { useMediaQuery } from '®hooks/useMediaQuery'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '®ui/drawer'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '®ui/sheet'
import { Navigation as Type, User as UserType } from '®app/login/types'
import { Navigation } from '®app/login/ui/navigation'

type PreviewProps = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function UserSheet({
    user,
    navigation,
}: {
    user: UserType | null
    navigation: Type[]
}) {
    const [open, setOpen] = useState(false)
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
                {user ? (
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
            <SheetDrawer navigation={navigation} open={open} setOpen={setOpen} user={user} />
        </>
    )
}

const UserDetails = ({ user }: { user: UserType }) => {
    if (!user) return null

    return (
        <HeroUser
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

function SheetDrawer({
    open,
    setOpen,
    user,
    navigation,
}: PreviewProps & { user: UserType | null; navigation: Type[] }) {
    const isDesktop = useMediaQuery('(min-width: 640px)')
    const router = useRouter()

    const handleSignOut = async () => {
        setOpen(false)
        // You may want to call a server action for sign out here
        router.push('/login')
    }

    const handleClose = () => {
        setOpen(false)
    }

    if (!user) return null

    return (
        <>
            {isDesktop ? (
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent className='flex flex-col gap-0 p-0 sm:max-w-[280px]'>
                        <SheetHeader aria-label='Profile' className='border-b p-2'>
                            <SheetTitle>
                                <UserDetails user={user} />
                            </SheetTitle>
                        </SheetHeader>
                        <ScrollShadow hideScrollBar className='flex-1'>
                            <Navigation navigation={navigation} onClose={handleClose} />
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
                            <UserDetails user={user} />
                            <Navigation navigation={navigation} onClose={handleClose} />
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
