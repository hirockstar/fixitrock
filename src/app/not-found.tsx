'use client'
import { Button } from '@heroui/react'
import { Undo2 } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center dark:from-gray-900 dark:to-gray-800">
            <div className="text-center px-4 relative">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="relative">
                    <h1 className="text-9xl font-bold text-gray-800 dark:text-white mb-4 animate-pulse">404</h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
                    <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-balance mx-auto">
                        Oops! The page you're looking for seems to have vanished into thin air.
                    </p>
                    <Button
                        as={Link}    
                        color="primary"
                        href="/" 
                        startContent={<Undo2 size={20} />}
                    >
                        Home
                    </Button>
                </div>
            </div>
        </div>
    )
}
