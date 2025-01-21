'use client'

import { motion, useAnimation } from 'motion/react'
import { useEffect, useState } from 'react'
import { useMediaQuery } from '®/hooks/useMediaQuery'
import useScroll from '®/hooks/useScroll'
import { Bottom } from '®/lib/FramerMotionVariants'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '../drawer'

interface AnimatedSearchProps {
    children: React.ReactNode
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AnimatedSearch({ children, open, setOpen }: AnimatedSearchProps) {
    const { scrollY, direction } = useScroll()
    const isHidden = scrollY > 0 && direction === 'down'
    const controls = useAnimation()

    useEffect(() => {
        const animate = async () => await controls.start(isHidden ? 'hidden' : 'visible')
        animate()
        return () => controls.stop()
    }, [isHidden, controls])

    return (
        <div className='flex flex-col items-center justify-center'>
            <div
                key={open ? 'focused' : 'unfocused'}
                className={`${open && 'fixed inset-0 z-50 backdrop-blur-[1px]'}`}
                onClick={() => setOpen(false)}
            />
            <motion.div
                className={`fixed bottom-4 z-50 w-[95%] md:w-[640px]`}
                variants={Bottom}
                initial={isHidden && !open ? 'hidden' : 'visible'}
                animate={controls}
                transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            >
                <Modal open={open} setOpen={setOpen}>
                    {children}
                </Modal>
            </motion.div>
        </div>
    )
}

export function Modal({ children, open, setOpen }: AnimatedSearchProps) {
    const isDesktop = useMediaQuery('(min-width: 640px)')

    if (isDesktop) {
        return (
            <div
                className={`z-50 w-full transition-transform duration-300 md:w-[640px] ${open && 'fixed bottom-4 max-w-[95%] translate-y-[-23dvh] transform overflow-hidden rounded-xl border bg-background'}`}
            >
                {children}
            </div>
        )
    }
    return (
        <>
            {!open && <div className='z-50 w-full'>{children}</div>}
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className='overflow-hidden'>
                    <DrawerHeader className='sr-only'>
                        <DrawerTitle />
                        <DrawerDescription />
                    </DrawerHeader>
                    {children}
                </DrawerContent>
            </Drawer>
        </>
    )
}

export const useOpen = () => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                    event.preventDefault()
                    setOpen(true)
                }
                if (event.key === 'Escape') {
                    setOpen(false)
                }
            }

            document.addEventListener('keydown', handleKeyDown)

            return () => {
                document.removeEventListener('keydown', handleKeyDown)
            }
        }
    }, [])

    useEffect(() => {
        if (open && typeof window !== 'undefined') {
            document.documentElement.style.overflow = 'hidden'

            const isScrollable =
                document.documentElement.scrollHeight > document.documentElement.clientHeight
            document.documentElement.style.paddingRight = isScrollable ? '11px' : '0px'
        } else {
            document.documentElement.style.overflow = ''
            document.documentElement.style.paddingRight = ''
        }
    }, [open])

    return {
        open,
        setOpen,
    }
}
