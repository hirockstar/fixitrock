'use client'
import { Component, ReactNode } from 'react'
import { addToast, Button } from '@heroui/react'

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
        let title = 'An error occurred'
        let description = error.message || 'Something went wrong'
        let color: 'danger' | 'warning' = 'danger'
        let endContent: React.ReactNode | undefined

        // Handle specific error types
        if (
            error.message.includes('Not authenticated') ||
            error.message.includes('Authentication failed')
        ) {
            title = 'Authentication Error'
            description = 'Please log in again to continue'
            color = 'warning'
            endContent = (
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
            description =
                "You don't have permission to perform this action. Contact support if needed."
            color = 'warning'
            endContent = (
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
                        color='secondary'
                        size='sm'
                        variant='flat'
                        onPress={() => this.handleContactSupport(error)}
                    >
                        Contact Support
                    </Button>
                </div>
            )
        } else if (error.message.includes('Network') || error.message.includes('fetch')) {
            title = 'Network Error'
            description = 'Please check your internet connection and try again'
            color = 'warning'
            endContent = (
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
            title = 'Authentication Error'
            description = 'Please re-authenticate with your account'
            color = 'warning'
            endContent = (
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
            // For unknown errors, provide both Try Again and Contact Support buttons
            description = `${error.message || 'An unexpected error occurred'}. Try again or contact support if the issue persists.`
            endContent = (
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
                        color='secondary'
                        size='sm'
                        variant='flat'
                        onPress={() => this.handleContactSupport(error)}
                    >
                        Contact Support
                    </Button>
                </div>
            )
        }

        addToast({
            title,
            description,
            color,
            endContent,
        })

        // Auto-recover from certain errors after a delay
        if (color === 'warning') {
            setTimeout(() => {
                this.setState({ hasError: false, error: undefined })
            }, 5000) // Auto-recover after 5 seconds for warning-level errors
        }
    }

    handleContactSupport = (error: Error) => {
        // Redirect to WhatsApp for support
        const whatsappUrl = 'https://wa.me/919927242828'
        const message = `Hi, I need support for an error: ${error.message}`
        const encodedMessage = encodeURIComponent(message)

        window.open(`${whatsappUrl}?text=${encodedMessage}`, '_blank')
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
