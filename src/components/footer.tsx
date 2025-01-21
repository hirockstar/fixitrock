'use client'
import { Link } from '@heroui/react'
import { siteConfig } from '®/config/site'
import ThemeSwitcher from './theme'
import { Status } from '®/ui/status'

export default function Footer() {
    return (
        <footer className='mt-4 w-full border-t dark:bg-[#0a0a0a]'>
            <div className='mx-auto flex w-full max-w-7xl items-center justify-between p-4'>
                <Link className='select-none text-sm font-black' href='/' color='foreground'>
                    {siteConfig.title}
                </Link>
                <div className='flex items-center gap-2'>
                    <Status />
                    <ThemeSwitcher />
                </div>
            </div>
        </footer>
    )
}
