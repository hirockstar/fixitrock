'use client'

import type React from 'react'

import { Input } from '@heroui/react'
import { useState, useRef, useEffect } from 'react'

import { Label } from '®ui/label'

interface DateInputProps {
    value?: string // Expected format: YYYY-MM-DD
    onChange?: (date: string) => void // Returns format: YYYY-MM-DD
    placeholder?: {
        day?: string
        month?: string
        year?: string
    }
    onError?: (error: string) => void // Called with error message or ''
}

export default function DateInput({
    value = '',
    onChange,
    placeholder = { day: 'DD', month: 'MM', year: 'YYYY' },
    onError,
}: DateInputProps) {
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [error, setError] = useState('')
    const justAutoMovedDayRef = useRef(false)
    const justAutoMovedMonthRef = useRef(false)

    const dayRef = useRef<HTMLInputElement>(null)
    const monthRef = useRef<HTMLInputElement>(null)
    const yearRef = useRef<HTMLInputElement>(null)

    // Parse incoming date value (YYYY-MM-DD) and set individual fields
    useEffect(() => {
        if (value && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [yearPart, monthPart, dayPart] = value.split('-')

            setDay(dayPart)
            setMonth(monthPart)
            setYear(yearPart)
            setError('')
        } else if (!value) {
            setDay('')
            setMonth('')
            setYear('')
            setError('')
        }
    }, [value])

    // Helper to check if a year is a leap year
    const isLeapYear = (year: number) => {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    }

    // Helper to get max days in a month
    const getMaxDays = (month: number, year: number) => {
        if (month === 2) {
            return isLeapYear(year) ? 29 : 28
        }
        if ([4, 6, 9, 11].includes(month)) {
            return 30
        }

        return 31
    }

    // Helper to check if a date is at least 18 years ago
    const isAtLeast18 = (y: number, m: number, d: number) => {
        const today = new Date()
        const dob = new Date(y, m - 1, d)
        const age = today.getFullYear() - dob.getFullYear()
        const mDiff = today.getMonth() - dob.getMonth()
        const dDiff = today.getDate() - dob.getDate()

        if (age > 18 || (age === 18 && (mDiff > 0 || (mDiff === 0 && dDiff >= 0)))) {
            return true
        }

        return false
    }

    // Handle input changes and auto-focus
    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 2)
        const monthNum = Number.parseInt(month)
        const yearNum = Number.parseInt(year)
        let errorMsg = ''
        let shouldAutoMove = false

        if (val.length === 2) {
            const dayNum = Number.parseInt(val)

            // Only allow 01-31 and valid for month/year
            if (dayNum < 1 || dayNum > 31) {
                errorMsg = 'Please enter a valid day.'
                val = ''
            } else if (monthNum && yearNum) {
                const maxDay = getMaxDays(monthNum, yearNum)

                if (dayNum > maxDay) {
                    errorMsg = 'Please enter a valid day.'
                    val = ''
                } else {
                    shouldAutoMove = true
                }
            } else {
                // If valid and not 00, auto-move to month
                shouldAutoMove = true
            }
        } else if (val === '00') {
            errorMsg = 'Please enter a valid day.'
            val = ''
        }
        setDay(val)
        setError(errorMsg)
        updateDate(val, month, year)
        // Only auto-move if no error and value is still two digits
        if (!errorMsg && shouldAutoMove && val.length === 2) {
            justAutoMovedDayRef.current = true
            monthRef.current?.focus()
        }
    }

    const handleDayBlur = () => {
        if (justAutoMovedDayRef.current) {
            justAutoMovedDayRef.current = false

            return
        }
        if (day.length === 1 && day !== '0') {
            const padded = '0' + day

            setDay(padded)
            updateDate(padded, month, year)
        }
        // If already two digits, do nothing
    }

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 2)
        let errorMsg = ''
        let shouldAutoMove = false

        if (val.length === 2) {
            const num = Number.parseInt(val)

            if (num < 1 || num > 12) {
                errorMsg = 'Please enter a valid month.'
                val = ''
            } else {
                shouldAutoMove = true
            }
        } else if (val === '00') {
            errorMsg = 'Please enter a valid month.'
            val = ''
        }
        setMonth(val)
        setError(errorMsg)
        // After changing month, revalidate day
        const dayNum = Number.parseInt(day)
        const yearNum = Number.parseInt(year)

        if (day && val && year && dayNum && yearNum) {
            const maxDay = getMaxDays(Number.parseInt(val), yearNum)

            if (dayNum > maxDay) {
                setDay('')
                setError('Please enter a valid day.')
            }
        }
        updateDate(day, val, year)
        if (!errorMsg && shouldAutoMove && val.length === 2) {
            justAutoMovedMonthRef.current = true
            yearRef.current?.focus()
        }
    }

    const handleMonthBlur = () => {
        if (justAutoMovedMonthRef.current) {
            justAutoMovedMonthRef.current = false

            return
        }
        if (month.length === 1 && month !== '0') {
            const padded = '0' + month

            setMonth(padded)
            updateDate(day, padded, year)
        }
        // If already two digits, do nothing
    }

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 4)

        // Only allow >= 1900
        if (val.length === 4) {
            const num = Number.parseInt(val)

            if (num < 1900) {
                val = ''
            }
        }
        setYear(val)
        // After changing year, revalidate day (for leap years)
        const dayNum = Number.parseInt(day)
        const monthNum = Number.parseInt(month)

        if (day && month && val && dayNum && monthNum) {
            const maxDay = getMaxDays(monthNum, Number.parseInt(val))

            if (dayNum > maxDay) {
                setDay('')
            }
        }
        updateDate(day, month, val)
    }

    // Update parent component with formatted date
    const updateDate = (d: string, m: string, y: string) => {
        if (!d || !m || !y) {
            setError('Please enter a valid date.')

            return
        }
        if (d === '00' || m === '00' || y.length !== 4) {
            setError('Please enter a valid date.')

            return
        }
        if (d && m && y && d.length === 2 && m.length === 2 && y.length === 4) {
            const dayNum = Number.parseInt(d)
            const monthNum = Number.parseInt(m)
            const yearNum = Number.parseInt(y)

            if (y.length !== 4) {
                setError('Please enter a 4-digit year.')

                return
            }
            if (dayNum < 1 || dayNum > 31) {
                setError('Please enter a valid day.')

                return
            }
            if (monthNum < 1 || monthNum > 12) {
                setError('Please enter a valid month.')

                return
            }
            if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900) {
                const formattedDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`

                // 18+ validation
                if (!isAtLeast18(yearNum, monthNum, dayNum)) {
                    setError('You must be at least 18 years old.')

                    return
                } else {
                    setError('')
                }
                onChange?.(formattedDate)
            }
        } else {
            if (y && y.length > 0 && y.length !== 4) {
                setError('Please enter a 4-digit year.')
            } else {
                setError('')
            }
        }
    }

    // Handle backspace navigation
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        field: 'day' | 'month' | 'year'
    ) => {
        if (e.key === 'Backspace') {
            const target = e.target as HTMLInputElement

            if (target.value === '' || target.selectionStart === 0) {
                if (field === 'month' && day !== '') {
                    dayRef.current?.focus()
                } else if (field === 'year' && month !== '') {
                    monthRef.current?.focus()
                }
            }
        }
    }

    useEffect(() => {
        if (onError) onError(error)
    }, [error, onError])

    return (
        <div className='space-y-2.5'>
            <Label>Date of Birth</Label>
            <div className='flex items-center gap-4'>
                <Input
                    ref={dayRef}
                    className='w-12 min-w-0'
                    classNames={{
                        input: 'text-center',
                    }}
                    max={31}
                    maxLength={2}
                    min={1}
                    placeholder={placeholder.day}
                    type='text'
                    value={day}
                    onBlur={handleDayBlur}
                    onChange={handleDayChange}
                    onKeyDown={(e) => handleKeyDown(e, 'day')}
                />

                <Input
                    ref={monthRef}
                    className='w-12 min-w-0'
                    classNames={{
                        input: 'text-center',
                    }}
                    max={12}
                    maxLength={2}
                    min={1}
                    placeholder={placeholder.month}
                    type='text'
                    value={month}
                    onBlur={handleMonthBlur}
                    onChange={handleMonthChange}
                    onKeyDown={(e) => handleKeyDown(e, 'month')}
                />

                <Input
                    ref={yearRef}
                    className='w-16 min-w-0'
                    classNames={{
                        input: 'text-center',
                    }}
                    maxLength={4}
                    min={1900}
                    placeholder={placeholder.year}
                    type='text'
                    value={year}
                    onChange={handleYearChange}
                    onKeyDown={(e) => handleKeyDown(e, 'year')}
                />
            </div>
            {error && <div className='mt-1 text-xs text-red-500'>{error}</div>}
        </div>
    )
}
