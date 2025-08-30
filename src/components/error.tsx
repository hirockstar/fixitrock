'use client'
import { Component, ReactNode } from 'react'
import { Button } from '@heroui/react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

import { logWarning } from '@/lib/utils'

interface Props {
    children: ReactNode
}
interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error) {
        logWarning('ErrorBoundary caught an error:', error)

        // Determine error type and show appropriate toast
        let title = 'Error'
        let description = this.getShortErrorDescription(error.message)
        let toastType: 'error' | 'warning' = 'error'
        let action: React.ReactNode | undefined

        // Handle specific error types
        if (
            error.message.includes('Not authenticated') ||
            error.message.includes('Authentication failed')
        ) {
            title = 'Auth Error'
            description = 'Please log in again'
            toastType = 'warning'
            action = (
                <Button
                    color='primary'
                    size='sm'
                    variant='flat'
                    onPress={() => this.setState({ hasError: false, error: undefined })}
                >
                    Try Again
                </Button>
            )
        } else if (
            error.message.includes('Access denied') ||
            error.message.includes('Not authorized')
        ) {
            title = 'Access Denied'
            description = "You don't have permission"
            toastType = 'warning'
            action = (
                <Button
                    color='primary'
                    size='sm'
                    variant='flat'
                    onPress={() => this.setState({ hasError: false, error: undefined })}
                >
                    Try Again
                </Button>
            )
        } else if (error.message.includes('Network') || error.message.includes('fetch')) {
            title = 'Network Error'
            description = 'Check internet connection'
            toastType = 'warning'
            action = (
                <Button
                    color='primary'
                    size='sm'
                    variant='flat'
                    onPress={() => this.setState({ hasError: false, error: undefined })}
                >
                    Try Again
                </Button>
            )
        } else if (error.message.includes('Token') || error.message.includes('OAuth')) {
            title = 'Auth Error'
            description = 'Re-authenticate required'
            toastType = 'warning'
            action = (
                <Button
                    color='primary'
                    size='sm'
                    variant='flat'
                    onPress={() => this.setState({ hasError: false, error: undefined })}
                >
                    Try Again
                </Button>
            )
        } else {
            // For unknown errors, provide Try Again and Copy buttons
            action = (
                <div className='flex gap-2'>
                    <Button
                        color='primary'
                        size='sm'
                        variant='flat'
                        onPress={() => this.setState({ hasError: false, error: undefined })}
                    >
                        Try Again
                    </Button>
                    <Button
                        isIconOnly
                        className='min-w-unit-8'
                        size='sm'
                        variant='light'
                        onPress={() => this.handleCopyError(error)}
                    >
                        <Copy size={16} />
                    </Button>
                </div>
            )
        }

        // Show toast based on type
        if (toastType === 'error') {
            toast.error(title, {
                description,
                action,
            })
        } else {
            toast.warning(title, {
                description,
                action,
            })
        }

        // Auto-recover from certain errors after a delay
        if (toastType === 'warning') {
            setTimeout(() => {
                this.setState({ hasError: false, error: undefined })
            }, 5000) // Auto-recover after 5 seconds for warning-level errors
        }
    }

    getShortErrorDescription = (message: string): string => {
        // Extract the most relevant part of the error message
        if (message.includes('map is not a function')) return 'Invalid data structure'
        if (message.includes('Cannot read properties')) return 'Property access failed'
        if (message.includes('is not defined')) return 'Variable not defined'
        if (message.includes('Unexpected token')) return 'Syntax error'
        if (message.includes('Failed to fetch')) return 'Request failed'
        if (message.includes('timeout')) return 'Request timeout'

        // For other errors, take first 50 characters
        return message.length > 50 ? message.substring(0, 50) + '...' : message
    }

    handleCopyError = (error: Error) => {
        const errorText = `${error.name}: ${error.message}\nStack: ${error.stack}`

        navigator.clipboard
            .writeText(errorText)
            .then(() => {
                toast.success('Copied!', {
                    description: 'Error details copied to clipboard',
                })
            })
            .catch(() => {
                toast.error('Copy failed', {
                    description: 'Could not copy error details',
                })
            })
    }

    render() {
        if (this.state.hasError) {
            // Don't render fallback UI, just return children
            // The error is already handled by the toast
            // Users can refresh the page or navigate away to recover
            return this.props.children
        }

        return this.props.children
    }
}
