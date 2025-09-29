import { useRef, useEffect } from 'react'

/**
 * Hook to enable drag-to-scroll functionality on horizontal scrollable elements
 * Provides the same touch-like dragging experience on desktop as on mobile devices
 */
export const useDragScroll = () => {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = scrollRef.current

        if (!element) return

        let isDown = false
        let startX: number
        let scrollLeft: number

        const handleMouseDown = (e: MouseEvent) => {
            isDown = true
            element.classList.add('active')
            startX = e.pageX - element.offsetLeft
            scrollLeft = element.scrollLeft
            element.style.cursor = 'grabbing'
        }

        const handleMouseLeave = () => {
            isDown = false
            element.classList.remove('active')
            element.style.cursor = 'grab'
        }

        const handleMouseUp = () => {
            isDown = false
            element.classList.remove('active')
            element.style.cursor = 'grab'
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDown) return
            e.preventDefault()
            const x = e.pageX - element.offsetLeft
            const walk = (x - startX) * 1.5 // Scroll speed multiplier

            element.scrollLeft = scrollLeft - walk
        }

        // Set initial cursor
        element.style.cursor = 'grab'

        element.addEventListener('mousedown', handleMouseDown)
        element.addEventListener('mouseleave', handleMouseLeave)
        element.addEventListener('mouseup', handleMouseUp)
        element.addEventListener('mousemove', handleMouseMove)

        return () => {
            element.removeEventListener('mousedown', handleMouseDown)
            element.removeEventListener('mouseleave', handleMouseLeave)
            element.removeEventListener('mouseup', handleMouseUp)
            element.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return scrollRef
}
