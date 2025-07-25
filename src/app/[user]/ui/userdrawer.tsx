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
import { Verified } from '®ui/icons'
import { useAuth } from '®zustand/store'

export default function UserDrawer({
    user,
    navigation,
}: {
    user: UserType | null
    navigation: Type[]
}) {
    const { logout } = useAuth()

    const [open, setOpen] = useState(false)
    const router = useRouter()
    const isDesktop = useMediaQuery('(min-width: 786px)')

    const handleSignOut = () => {
        setOpen(false)
        logout()
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
                            (user.avatar ||
                                (user.gender === 'female'
                                    ? '/fallback/girl.png'
                                    : user.gender === 'other'
                                      ? '/fallback/other.png'
                                      : '/fallback/boy.png')) +
                            (user.updated_at ? `?t=${user.updated_at}` : '')
                        }
                        width={30}
                    />
                ) : (
                    <FaUserCircle aria-label='Login to your account' size={22} />
                )}
            </Button>

            <Drawer direction={isDesktop ? 'right' : 'bottom'} open={open} onOpenChange={setOpen}>
                <DrawerContent
                    hideCloseButton={isDesktop ? true : false}
                    showbar={isDesktop ? false : true}
                >
                    <DrawerHeader className='p-2 md:border-b'>
                        <UserDetails user={user as UserType} />
                    </DrawerHeader>
                    <DrawerTitle aria-hidden />
                    <DrawerDescription aria-hidden />
                    <Navigation navigation={navigation} onClose={onClose} />
                    <DrawerFooter className='flex flex-col gap-2 p-2 md:border-t'>
                        <Button fullWidth color='danger' type='submit' onPress={handleSignOut}>
                            Logout
                        </Button>

                        <p className='text-muted-foreground hidden text-start text-xs md:flex'>
                            © 2025, Fix it Rock.
                        </p>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

const UserDetails = ({ user }: { user: UserType }) => {
    if (!user) return null

    return (
        <HeroUser
            avatarProps={{
                src:
                    (user.avatar ||
                        (user.gender === 'female'
                            ? '/fallback/girl.png'
                            : user.gender === 'other'
                              ? '/fallback/other.png'
                              : '/fallback/boy.png')) +
                    (user.updated_at ? `?t=${user.updated_at}` : ''),
                fallback: user.name,
                className: 'w-12 h-12',
            }}
            classNames={{
                base: 'flex justify-start px-2 sm:px-0',
                name: 'text-md flex items-center gap-1',
            }}
            description={`@${user.username}`}
            name={
                <>
                    {user.name}
                    {user.verified && <Verified className='size-5' />}
                </>
            }
        />
    )
}
