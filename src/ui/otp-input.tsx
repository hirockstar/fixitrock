'use client'
import React, { useRef } from 'react'

interface OTPInputProps {
    value: string[]
    onChange: (value: string[]) => void
    length?: number
    disabled?: boolean
}

export function OTPInput({ value, onChange, length = 6, disabled = false }: OTPInputProps) {
    const inputs = Array.from({ length })
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (idx: number, val: string) => {
        if (!/^[0-9]?$/.test(val)) return
        const newValue = [...value]
        newValue[idx] = val
        onChange(newValue)
        if (val && idx < length - 1) {
            inputRefs.current[idx + 1]?.focus()
        }
    }

    const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus()
        }
    }

    return (
        <div className='flex items-center justify-center gap-2'>
            {inputs.map((_, idx) => (
                <input
                    key={idx}
                    ref={(el) => {
                        inputRefs.current[idx] = el
                    }}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    className='h-12 w-12 rounded-lg border border-input bg-background text-center font-mono text-2xl transition-all focus:border-primary focus:outline-none disabled:opacity-50'
                    value={value[idx] || ''}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    disabled={disabled}
                    autoComplete='one-time-code'
                />
            ))}
        </div>
    )
}

export default OTPInput
