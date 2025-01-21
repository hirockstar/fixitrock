'use client'
import { motion } from 'motion/react'
import { AnimatedTAGProps } from '®/types/drive'

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
            initial='hidden'
            whileInView='visible'
            viewport={{ once: !infinity }}
            variants={selectedVariants}
            className={className}
            transition={{
                staggerChildren: 0.1,
                delayChildren: 0.2,
            }}
            layout
            {...motionProps}
        >
            {children}
        </motion.div>
    )
}
