'use client'

import { Button, Input as Drive, InputProps as Props } from '@heroui/react'
import { Loader, Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

type InputProps = {
    value?: string
    hotKey?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    end?: React.ReactNode
} & Props

export function Input({ value = '', hotKey, end, onChange, ...inputProps }: InputProps) {
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
                    'h-10 min-h-10 w-full rounded-sm border bg-transparent shadow-none data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent',
                base: 'sm:w-[90%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]',
            }}
            endContent={
                <>
                    {!value && hotKey && (
                        <Button
                            isIconOnly
                            className='hidden h-5 w-5 !min-w-5 rounded border bg-default/20 text-[12px] dark:bg-default/40 sm:block'
                            radius='none'
                            size='sm'
                            variant='light'
                        >
                            {hotKey.toUpperCase()}
                        </Button>
                    )}
                    {end}
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
