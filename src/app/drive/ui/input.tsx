'use client'

import { Button, Input as Drive, InputProps as Props } from '@heroui/react'
import { Loader, Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

type InputProps = {
    value?: string
    hotKey?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
} & Props

export function Input({ value = '', hotKey, onChange, ...inputProps }: InputProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (value) {
            setIsLoading(true)
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, 300)

            return () => clearTimeout(timer)
        }
        setIsLoading(false)
    }, [value])

    useHotkeys(
        hotKey || '',
        (event) => {
            if (hotKey) {
                event.preventDefault()
                inputRef.current?.focus()
            }
        },
        [hotKey]
    )

    return (
        <Drive
            ref={inputRef}
            className='bg-transparent'
            classNames={{
                inputWrapper:
                    'h-9 min-h-9 w-full rounded-md border bg-transparent shadow-none data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent',
            }}
            endContent={
                <>
                    {!value && hotKey && (
                        <Button
                            isIconOnly
                            className='hidden h-5 w-5 !min-w-5 rounded-sm border bg-default/20 text-[12px] dark:bg-default/40 sm:block'
                            radius='none'
                            size='sm'
                            variant='light'
                        >
                            {hotKey.toUpperCase()}
                        </Button>
                    )}
                </>
            }
            size='sm'
            startContent={
                <>
                    {isLoading ? (
                        <Loader className='h-4 w-4 shrink-0 animate-spin text-muted-foreground' />
                    ) : (
                        <Search className='h-4 w-4 shrink-0' />
                    )}
                </>
            }
            type='search'
            value={value}
            onChange={onChange}
            {...inputProps}
        />
    )
}
