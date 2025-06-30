'use client'
import { Listbox, ListboxItem } from '@heroui/react'
import React from 'react'
import * as Icons from 'lucide-react'
import Link from 'next/link'
import { User } from 'lucide-react'

import { useUser } from '®provider/user'

type NavLinksProps = {
    onClose?: () => void
}

const NavLinks = ({ onClose }: NavLinksProps) => {
    const { user, navLinks } = useUser()
    const userBasePath = React.useMemo(() => (user ? `/@${user.username}` : ''), [user?.username])

    const handleClick = () => {
        if (onClose) onClose()
    }

    if (!user) return null

    return (
        <Listbox className='w-full' variant='flat'>
            <>
                <ListboxItem
                    as={Link}
                    href={userBasePath}
                    startContent={<User size={20} />}
                    onPress={handleClick}
                >
                    My Profile
                </ListboxItem>
                {navLinks.map((link) => {
                    // Prefix user path to link.href
                    const fullPath = `${userBasePath}${link.href}`

                    if (!link.icon) {
                        // No icon specified
                        return (
                            <ListboxItem
                                key={link.id}
                                as={Link}
                                href={fullPath}
                                onPress={handleClick}
                            >
                                {link.title}
                            </ListboxItem>
                        )
                    }
                    const iconName = link.icon.charAt(0).toUpperCase() + link.icon.slice(1)
                    const LucideIcon = Icons[iconName as keyof typeof Icons] as
                        | React.ElementType
                        | undefined

                    return (
                        <ListboxItem
                            key={link.id}
                            as={Link}
                            href={fullPath}
                            startContent={LucideIcon ? <LucideIcon className='h-4 w-4' /> : null}
                            onPress={handleClick}
                        >
                            {link.title}
                        </ListboxItem>
                    )
                })}
            </>
        </Listbox>
    )
}

export default NavLinks
