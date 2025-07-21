'use client'

import { useState, useTransition, useEffect } from 'react'
import { Button, Input, addToast } from '@heroui/react'
import { Minus, Plus } from 'lucide-react'

import { Product } from '®types/products'
import { setProductQty } from '®actions/user/products'
import { useEvent } from '®zustand/store'

interface QuantityProps {
    product: Product
    canManage: boolean
}

export default function Quantity({ product, canManage }: QuantityProps) {
    const { refreshVersion } = useEvent()
    const [localQty, setLocalQty] = useState(product.qty)
    const [inputValue, setInputValue] = useState(String(product.qty))
    const [isPending, startTransition] = useTransition()

    // Sync with real-time updates from parent
    useEffect(() => {
        setLocalQty(product.qty)
        setInputValue(String(product.qty))
    }, [product.qty, refreshVersion])

    const handleUpdateQuantity = async (newQty: number) => {
        try {
            await setProductQty(product.id, newQty)
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Failed to update quantity'

            addToast({
                title: 'Error',
                description: errorMessage,
                color: 'danger',
            })

            // Revert local state on error
            setLocalQty(product.qty)
            setInputValue(String(product.qty))
        }
    }

    const handleIncrement = () => {
        if (!canManage) return

        const newQty = localQty + 1

        setLocalQty(newQty)
        setInputValue(String(newQty))

        startTransition(async () => {
            await handleUpdateQuantity(newQty)
        })
    }

    const handleDecrement = () => {
        if (!canManage || localQty <= 0) return

        const newQty = localQty - 1

        setLocalQty(newQty)
        setInputValue(String(newQty))

        startTransition(async () => {
            await handleUpdateQuantity(newQty)
        })
    }

    const handleInputChange = (value: string) => {
        setInputValue(value)
        const numValue = parseInt(value) || 0

        if (numValue >= 0) {
            setLocalQty(numValue)
        }
    }

    const handleInputBlur = () => {
        const numValue = parseInt(inputValue) || 0
        const finalValue = numValue < 0 ? 0 : numValue

        setInputValue(String(finalValue))
        setLocalQty(finalValue)

        if (finalValue !== product.qty) {
            startTransition(async () => {
                await handleUpdateQuantity(finalValue)
            })
        }
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur()
        }
    }

    if (!canManage) {
        return <>{product.qty}</>
    }

    return (
        <div className='flex items-center justify-center gap-1 sm:gap-2'>
            <Button
                isIconOnly
                className='h-6 w-6 min-w-6 sm:h-7 sm:w-7'
                isDisabled={localQty <= 0 || isPending}
                radius='full'
                size='sm'
                variant='light'
                onPress={handleDecrement}
            >
                <Minus className='sm:h-3.5 sm:w-3.5' size={12} />
            </Button>

            <Input
                className='w-12 min-w-0 sm:w-14'
                classNames={{
                    input: 'text-center text-xs sm:text-sm',
                    inputWrapper: 'h-6 min-h-6 sm:h-7 sm:min-h-7',
                }}
                isDisabled={isPending}
                min={0}
                size='sm'
                type='number'
                value={inputValue}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                onValueChange={handleInputChange}
            />

            <Button
                isIconOnly
                className='h-6 w-6 min-w-6 sm:h-7 sm:w-7'
                isDisabled={isPending}
                radius='full'
                size='sm'
                variant='light'
                onPress={handleIncrement}
            >
                <Plus className='sm:h-3.5 sm:w-3.5' size={12} />
            </Button>
        </div>
    )
}
