'use client'
import { Component, ReactNode } from 'react'
import { addToast } from '@heroui/react'

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

        // Handle specific error types
        if (
            error.message.includes('Not authenticated') ||
            error.message.includes('Authentication failed')
        ) {
            title = 'Authentication Error'
            description = 'Please log in again to continue'
            color = 'warning'
        } else if (
            error.message.includes('Access denied') ||
            error.message.includes('Not authorized')
        ) {
            title = 'Access Denied'
            description = "You don't have permission to perform this action"
            color = 'warning'
        } else if (error.message.includes('Network') || error.message.includes('fetch')) {
            title = 'Network Error'
            description = 'Please check your internet connection and try again'
            color = 'warning'
        } else if (error.message.includes('Token') || error.message.includes('OAuth')) {
            title = 'Authentication Error'
            description = 'Please re-authenticate with your account'
            color = 'warning'
        }

        addToast({
            title,
            description,
            color,
        })
    }

    render() {
        if (this.state.hasError) {
            // Render a fallback UI that doesn't break the layout
            return (
                <div className='flex min-h-[200px] items-center justify-center p-4'>
                    <div className='text-center'>
                        <div className='mb-2 text-2xl text-red-500'>⚠️</div>
                        <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100'>
                            Something went wrong
                        </h3>
                        <p className='mb-4 text-gray-600 dark:text-gray-400'>
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <button
                            className='rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600'
                            onClick={() => this.setState({ hasError: false, error: undefined })}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
