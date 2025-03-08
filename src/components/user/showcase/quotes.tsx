'use client'

import { useQuote } from '®/hooks/useQuotes'
import AnimatedDiv from '®/ui/farmer/div'
import { BlogCardAnimation, fromLeftVariant } from '®/lib/FramerMotionVariants'
import { QuoteSkeleton } from '®/ui/skeleton'

import { Quote } from '../cards/quote'

export function Quotes() {
    const { data, isLoading } = useQuote()

    return (
        <div className='grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-2 px-1'>
            {isLoading ? (
                <QuoteSkeleton />
            ) : (
                data?.map((q) => (
                    <AnimatedDiv
                        key={q.id}
                        mobileVariants={BlogCardAnimation}
                        variants={fromLeftVariant}
                    >
                        <Quote q={q} />
                    </AnimatedDiv>
                ))
            )}
        </div>
    )
}
