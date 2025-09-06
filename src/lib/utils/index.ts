import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { User } from '@/app/login/types'
import { siteConfig } from '@/config/site'
import { DriveItem } from '@/types/drive'
import { Product } from '@/types/products'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function openCurrentLocationInMaps() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.')

        return
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`

        window.open(url, '_blank')
    })
}
export const Counts = (num: number): string => {
    if (num < 1000) {
        return num.toString()
    } else if (num < 1000000) {
        return (num / 1000).toFixed(1) + 'k'
    } else if (num < 1000000000) {
        return (num / 1000000).toFixed(1) + 'M'
    } else {
        return (num / 1000000000).toFixed(1) + 'B'
    }
}

export function logWarning(_message: string, _error?: unknown): void {
    if (process.env.NODE_ENV !== 'production') {
        // Mark variables as used in a no-op way
        void _message
        void _error

        // Custom logging mechanism to avoid console.warn
        // For example, you can send logs to a logging service
        // sendLogToService('warn', _message, _error);
    }
}

export const sanitizeQuery = (query: string): string[] => {
    // Normalize and tokenize the query into an array of words
    return query
        .toLowerCase() // Convert to lowercase for case-insensitive matching
        .replace(/[^a-z0-9\s]/gi, ' ') // Replace non-alphanumeric characters with spaces
        .trim() // Remove leading and trailing spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .split(' ') // Split into an array of words
}

export const getPreviewTypes = ['image/', 'video/']
export const previewExtensions = ['.md', '.mdx']

export const isPreviewable = (c: DriveItem) => {
    const isMimeTypePreviewable = getPreviewTypes.some((type) => c.file?.mimeType?.startsWith(type))
    const isExtensionPreviewable = previewExtensions.some((ext) => c.name?.endsWith(ext))

    return isMimeTypePreviewable || isExtensionPreviewable
}

export const isFolder = (c: DriveItem) => {
    return !!c.folder
}

export const getDownloadUrl = (c: DriveItem) => {
    return c['@microsoft.graph.downloadUrl']
}

export const cUrl = (c: DriveItem, pathname: string) => {
    if (isFolder(c)) {
        return `${pathname === '/' ? '' : pathname}/${c.name}`
    }
    if (isPreviewable(c)) {
        return `${pathname === '/' ? '' : pathname}?view=${c.name}`
    }

    return getDownloadUrl(c)
}

export const stateColors = {
    normal: 'bg-blue-500 text-blue-500',
    nearing: 'bg-yellow-500 text-yellow-500',
    critical: 'bg-red-500 text-red-500',
    exceeded: 'bg-purple-500 text-purple-500',
    server: 'bg-red-500 text-red-500',
}

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(price)
}

export const getStockStatus = (qty: number) => {
    if (qty === 0) return { color: 'danger' as const, text: 'Out of Stock' }
    if (qty <= 1) return { color: 'warning' as const, text: 'Low Stock' }

    return { color: 'success' as const, text: 'In Stock' }
}

// Helper to get the first image URL from product.img
export const getProductImage = (product: Product) => {
    if (!product.img || product.img.length === 0) return null
    const first = product.img[0]

    if (typeof first === 'string') return first
    if (typeof first === 'object' && first.url) return first.url

    return null
}

export function formatDateTime(dateTimeString?: string | null | undefined): string {
    if (!dateTimeString) {
        return ''
    }

    const date = new Date(dateTimeString)

    if (isNaN(date.getTime())) {
        throw new Error('Invalid date string provided')
    }

    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    const SECOND = 1
    const MINUTE = 60 * SECOND
    const HOUR = 60 * MINUTE
    const DAY = 24 * HOUR
    const WEEK = 7 * DAY

    const pluralize = (count: number, singular: string) =>
        `${count} ${singular}${count === 1 ? '' : 's'}`

    if (diffInSeconds < MINUTE) {
        return pluralize(diffInSeconds, 'sec') + ' ago'
    } else if (diffInSeconds < HOUR) {
        const minutes = Math.floor(diffInSeconds / MINUTE)

        return pluralize(minutes, 'min') + ' ago'
    } else if (diffInSeconds < DAY) {
        const hours = Math.floor(diffInSeconds / HOUR)

        return pluralize(hours, 'hr') + ' ago'
    } else if (diffInSeconds < WEEK) {
        const days = Math.floor(diffInSeconds / DAY)

        return pluralize(days, 'day') + ' ago'
    } else {
        // Manually format the date as "6 Aug 2023"
        const day = date.getDate()
        const month = date.toLocaleString('en-US', { month: 'short' })
        const year = date.getFullYear()

        return `${day} ${month} ${year}`
    }
}

export function formatCount(count: number): string {
    if (count === 0) {
        return '0 File'
    } else if (count === 1) {
        return '1 File'
    } else {
        return `${count} Files`
    }
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

export function path(url: string, isFile?: boolean) {
    const path = url
        .replace(
            `https://fixitrock-my.sharepoint.com/personal/space_fixitrock_com/Documents/${siteConfig.baseDirectory}`,
            `${siteConfig.directoryUrl}`
        )
        .trim()

    if (isFile) {
        const parts = path.split('/')
        const fileName = parts.pop()
        const folderPath = parts.join('/')

        return `${folderPath}#${fileName}`.toLowerCase()
    }

    return path.toLowerCase()
}

export const formatDuration = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000) // Convert milliseconds to seconds
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Get user avatar URL with fallback based on gender and cache busting
 * @param user - User object with avatar, gender, and updated_at
 * @returns Avatar URL string
 */
export function userAvatar(user: User): string {
    const fallbackAvatar =
        user?.gender === 'female'
            ? '/fallback/girl.png'
            : user?.gender === 'other'
              ? '/fallback/other.png'
              : '/fallback/boy.png'

    const avatarUrl = user?.avatar || fallbackAvatar || ''

    // Add cache busting parameter if user has been updated
    return user?.updated_at ? `${avatarUrl}?t=${user.updated_at}` : avatarUrl
}

// Download progress utilities
export { getDownloadBackground } from './downloadProgress'

/**
 * Wraps server actions with consistent error handling
 * This ensures all errors are properly caught and don't crash the UI
 */
export function withErrorHandling<T extends readonly unknown[], R>(
    action: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
        try {
            return await action(...args)
        } catch (error) {
            // Log the error for debugging
            logWarning('Server action error:', error)

            // Re-throw the error so it can be caught by ErrorBoundary
            if (error instanceof Error) {
                throw error
            } else {
                throw new Error(typeof error === 'string' ? error : 'An unexpected error occurred')
            }
        }
    }
}

/**
 * Creates a safe server action that returns structured error responses
 * instead of throwing errors
 */
export function createSafeAction<T extends readonly unknown[], R>(
    action: (...args: T) => Promise<R>
): (...args: T) => Promise<{ success: boolean; data?: R; error?: string }> {
    return async (...args: T) => {
        try {
            const result = await action(...args)

            return { success: true, data: result }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'An unexpected error occurred'

            return { success: false, error: errorMessage }
        }
    }
}

export function getGreeting() {
    const hour = new Date().getHours()

    if (hour >= 0 && hour < 4) return 'Ready to rock the night'
    if (hour >= 4 && hour < 12) return 'Time to crush it'
    if (hour >= 12 && hour < 17) return "Let's make moves"
    if (hour >= 17 && hour < 21) return 'Still got energy'

    return 'Night mode activated'
}

export function getGreetingWithName(name: string) {
    const hour = new Date().getHours()

    if (hour >= 0 && hour < 4) return `Hey ${name}, ready to rock the night?`
    if (hour >= 4 && hour < 12) return `Good morning ${name}, time to crush it!`
    if (hour >= 12 && hour < 17) return `Hey ${name}, let's make moves!`
    if (hour >= 17 && hour < 21) return `Evening ${name}, still got energy?`

    return `Night ${name}, mode activated!`
}

export function getSearchPlaceholder(name?: string) {
    if (!name) return 'What do you need?'

    const hour = new Date().getHours()
    const placeholders = [
        // Late night (0-3)
        `Hey ${name}, still awake? 😴 What's the plan?`,
        `Yo ${name}, burning the midnight oil? Let's find something!`,
        `${name}, night owl mode! What's cooking?`,
        `Still up ${name}? Let's get stuff done!`,
        `Insomniac ${name}? Let's explore!`,
        
        // Pre-dawn (3-6)
        `Early bird ${name}! What's the mission?`,
        `Yo ${name}, up before the sun? Let's go!`,
        `${name}, dawn patrol! What's cooking?`,
        `Hey ${name}, early riser! What's the plan?`,
        
        // Coffee time (6-9)
        `Morning ${name}, coffee time! ☕ What are we building?`,
        `Rise and shine ${name}! Ready to conquer?`,
        `Good morning ${name}, coffee in hand? Let's go!`,
        `Hey ${name}, first cup of the day? What's up?`,
        `Morning ${name}, caffeine mode! What's the game plan?`,
        `Yo ${name}, coffee break! Let's find something cool`,
        `${name}, morning fuel! What do you need?`,
        
        // Work mode (9-12)
        `Hey ${name}, work mode activated! What's the mission?`,
        `Morning ${name}, ready to hustle? Let's go!`,
        `Yo ${name}, productivity time! What's next?`,
        `${name}, morning grind! What's cooking?`,
        `Hey ${name}, let's get things done! What's up?`,
        
        // Lunch time (12-14)
        `Lunch time ${name}! 🍕 What's the plan?`,
        `Hey ${name}, lunch break! What's on the menu?`,
        `Yo ${name}, food time! Let's find something`,
        `${name}, lunch vibes! What do you need?`,
        `Hey ${name}, break time! What's cooking?`,
        `Lunch break ${name}! What's the move?`,
        
        // Post-lunch (14-17)
        `Afternoon ${name}, food coma over? Let's hustle!`,
        `Hey ${name}, post-lunch energy! What's next?`,
        `Afternoon ${name}, what's the mission?`,
        `Yo ${name}, afternoon grind time! What's up?`,
        `${name}, afternoon vibes! What do you need?`,
        `Hey ${name}, afternoon mode! Let's go!`,
        
        // Coffee break (15-17)
        `Coffee break ${name}! ☕ What's brewing?`,
        `Hey ${name}, afternoon coffee? Let's find something!`,
        `Yo ${name}, caffeine boost time! What's up?`,
        `${name}, coffee o'clock! What's the plan?`,
        
        // Evening wind down (17-19)
        `Evening ${name}, work day done? What's on your mind?`,
        `Hey ${name}, evening mode! What's the plan?`,
        `${name}, evening vibes! Let's find something cool`,
        `Evening ${name}, what's the mission?`,
        `Yo ${name}, evening hustle! What's next?`,
        `Hey ${name}, evening chill! What do you need?`,
        
        // Dinner time (19-21)
        `Dinner time ${name}! 🍽️ What's cooking?`,
        `Hey ${name}, dinner vibes! What's on the menu?`,
        `Yo ${name}, food time! Let's find something`,
        `${name}, dinner mode! What's the plan?`,
        `Hey ${name}, dinner break! What's up?`,
        `Dinner time ${name}! What's the move?`,
        
        // Night chill (21-23)
        `Night ${name}, what's the vibe?`,
        `Hey ${name}, night mode activated! Let's go!`,
        `${name}, night owl! What's cooking?`,
        `Night ${name}, ready to explore?`,
        `Yo ${name}, night vibes! What's the plan?`,
        `Hey ${name}, night chill! What do you need?`,
        
        // Late night (23-24)
        `Late night ${name}! What's the mission?`,
        `Hey ${name}, late night vibes! Let's find something`,
        `Yo ${name}, night owl mode! What's up?`,
        `${name}, late night energy! What's cooking?`
    ]

    // Return a random placeholder based on specific time ranges
    const timeBasedPlaceholders = placeholders.filter((_, index) => {
        if (hour >= 0 && hour < 3) return index < 5
        if (hour >= 3 && hour < 6) return index >= 5 && index < 9
        if (hour >= 6 && hour < 9) return index >= 9 && index < 16
        if (hour >= 9 && hour < 12) return index >= 16 && index < 21
        if (hour >= 12 && hour < 14) return index >= 21 && index < 27
        if (hour >= 14 && hour < 15) return index >= 27 && index < 33
        if (hour >= 15 && hour < 17) return index >= 33 && index < 37
        if (hour >= 17 && hour < 19) return index >= 37 && index < 43
        if (hour >= 19 && hour < 21) return index >= 43 && index < 49
        if (hour >= 21 && hour < 23) return index >= 49 && index < 55
        return index >= 55
    })

    return timeBasedPlaceholders[Math.floor(Math.random() * timeBasedPlaceholders.length)]
}

/**
 * Capitalizes the first letter of a string
 * @param text - The text to capitalize
 * @returns The text with the first letter capitalized
 */
export function capitalize(text: string): string {
    if (!text) return text

    return text.charAt(0).toUpperCase() + text.slice(1)
}
