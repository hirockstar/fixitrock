import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DriveItem } from '®/types/drive'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
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

export function formatBytes(bytes: number, decimals = 2): string {
    if (!Number.isFinite(bytes) || bytes < 0) return '0 Bytes'
    if (bytes === 0) return '0 Bytes'

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    const readableSize = (bytes / Math.pow(1024, i)).toFixed(i > 0 ? decimals : 0)

    return `${readableSize} ${sizes[i]}`
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
