'use client'

import { Button, Image, User as HeroUser } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'

import { useMediaQuery } from '®hooks/useMediaQuery'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
} from '®ui/drawer'
import { Navigation as Type, User as UserType } from '®app/login/types'
import { Navigation } from '®app/login/ui/navigation'
import { useUser } from '®provider/user'

export default function UserDrawer({
    user,
    navigation,
}: {
    user: UserType | null
    navigation: Type[]
}) {
    const { signOut } = useUser()
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const isDesktop = useMediaQuery('(min-width: 786px)')

    const handleSignOut = async () => {
        setOpen(false)
        await signOut()
    }

    const onClose = () => {
        setOpen(false)
    }

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
            <Drawer direction={isDesktop ? 'right' : 'bottom'} open={open} onOpenChange={setOpen}>
                <DrawerContent className='' showbar={isDesktop ? false : true}>
                    <DrawerHeader className='p-2 md:border-b'>
                        <UserDetails user={user} />
                    </DrawerHeader>
                    <DrawerTitle aria-hidden />
                    <DrawerDescription aria-hidden />
                    <Navigation navigation={navigation} onClose={onClose} />
                    <DrawerFooter className='flex flex-col gap-2 p-2 md:border-t'>
                        <Button fullWidth color='danger' onPress={handleSignOut}>
                            Logout
                        </Button>
                        <p className='text-muted-foreground hidden text-start text-xs md:flex'>
                            Fix it Rock © 2025
                        </p>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

const UserDetails = ({ user }: { user: UserType | null }) => {
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
