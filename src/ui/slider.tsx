// Dependencies: pnpm install lucide-react
'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '®/lib/utils'

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
        bufferedProgress?: number // New prop for buffered progress
        hideThumb?: boolean // New prop to hide the thumb
    }
>(({ className, bufferedProgress = 0, hideThumb = false, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn('relative flex w-full touch-none select-none items-center', className)}
        {...props}
    >
        <SliderPrimitive.Track className='relative h-1 w-full grow overflow-hidden rounded-full bg-muted'>
            {/* Buffered Progress Track */}
            <div
                className='absolute z-10 h-full bg-white'
                style={{ width: `${bufferedProgress}%` }} // Set width based on buffered progress
            />
            <SliderPrimitive.Range className='absolute z-20 h-full bg-[hsl(var(--ring))]' />
        </SliderPrimitive.Track>
        {!hideThumb && ( // Conditionally render the thumb
            <SliderPrimitive.Thumb className='z-30 block h-4 w-4 rounded-full bg-[hsl(var(--ring))] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2' />
        )}
    </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
