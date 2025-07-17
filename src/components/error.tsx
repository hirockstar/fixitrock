'use client'
import { Component, ReactNode } from 'react'
import { addToast } from '@heroui/react'

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
        addToast({
            title: 'An error occurred',
            description: error.message,
            color: 'danger',
        })
    }

    render() {
        if (this.state.hasError) {
            // Optionally render a fallback UI
            return null
        }

        return this.props.children
    }
}
