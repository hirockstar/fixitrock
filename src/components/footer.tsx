'use client'

import Link from 'next/link'

import { siteConfig } from '®config/site'
import { Status } from '®ui/status'

import ThemeSwitcher from './theme'

export default function Footer() {
    return (
        <footer className='mt-4 w-full border-t dark:bg-[#0a0a0a]'>
            <div className='mx-auto flex w-full max-w-7xl items-center justify-between p-4'>
                <Link
                    passHref
                    className='font-mono font-bold tracking-tighter select-none'
                    color='foreground'
                    href='/'
                >
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
