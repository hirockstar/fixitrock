'use client'
import { motion } from 'motion/react'

import { AnimatedTAGProps } from '®types/drive'

export default function AnimatedDiv({
    variants,
    mobileVariants,
    className,
    children,
    infinity,
    ...motionProps
}: AnimatedTAGProps) {
    const selectedVariants =
        typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
            ? mobileVariants
            : variants

    return (
        <motion.div
            layout
            className={className}
            initial='hidden'
            transition={{
                staggerChildren: 0.1,
                delayChildren: 0.2,
            }}
            variants={selectedVariants}
            viewport={{ once: !infinity }}
            whileInView='visible'
            {...motionProps}
        >
            {children}
        </motion.div>
    )
}
