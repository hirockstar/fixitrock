'use client'
import { Listbox, ListboxItem } from '@heroui/react'
import { useUser } from '®provider/user'
import React from 'react'
import * as Icons from 'lucide-react'
import Link from "next/link"
import { User } from "lucide-react"

type NavLinksProps = {
    onClose?: () => void
}

const NavLinks = ({ onClose }: NavLinksProps) => {
    const { user, navLinks } = useUser()
    const userBasePath = React.useMemo(() => user ? `/@${user.username}` : '', [user?.username])

    const handleClick = () => {
        if (onClose) onClose()
    }

    if (!user) return null

    return (
        <Listbox variant='flat' className="w-full">
            <>
                <ListboxItem
                    href={userBasePath}
                    as={Link}
                    onPress={handleClick}
                    startContent={<User size={20} />}
                >
                    My Profile
                </ListboxItem>
                {navLinks.map(link => {
                    // Prefix user path to link.href
                    const fullPath = `${userBasePath}${link.href}`
                    if (!link.icon) {
                        // No icon specified
                        return (
                            <ListboxItem
                                key={link.id}
                                href={fullPath}
                                as={Link}
                                onPress={handleClick}
                            >
                                {link.title}
                            </ListboxItem>
                        )
                    }
                    const iconName = link.icon.charAt(0).toUpperCase() + link.icon.slice(1)
                    const LucideIcon = Icons[iconName as keyof typeof Icons] as React.ElementType | undefined
                    return (
                        <ListboxItem
                            key={link.id}
                            href={fullPath}
                            as={Link}
                            startContent={LucideIcon ? <LucideIcon className="w-4 h-4" /> : null}
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