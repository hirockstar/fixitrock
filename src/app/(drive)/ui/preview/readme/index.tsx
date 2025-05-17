'use client'

import matter from 'gray-matter'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { useEffect, useState } from 'react'
import { SiMarkdown } from 'react-icons/si'

import { useReadme } from '®hooks/tanstack/query'
import { ErrorState } from '®ui/state'
import { cn, logWarning } from '®lib/utils'

import { IMG, Title, YouTube } from './components'

type ReadMeProps = {
    slug?: string
    src?: string
    className?: string
}

export function ReadMe({ slug, src: initialSrc, className }: ReadMeProps) {
    const { data: fetchedSrc, error } = useReadme(slug ? `/${slug}` : '')

    const src = initialSrc || fetchedSrc
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)

    useEffect(() => {
        if (!src) return

        const fetchAndProcessMdx = async () => {
            try {
                let content = src

                if (src.startsWith('http')) {
                    const response = await fetch(src)

                    if (!response.ok)
                        throw new Error(`Failed to fetch MDX content: ${response.statusText}`)
                    content = await response.text()
                }

                const { content: mdxContent } = matter(content)
                const serializedContent = await serialize(mdxContent)

                setMdxSource(serializedContent)
            } catch (err) {
                logWarning('MDX processing error:', err)
            }
        }

        fetchAndProcessMdx()
    }, [src])

    if (error) {
        return <ErrorState icons={[SiMarkdown]} message={error.message} />
    }

    if (!mdxSource) {
        return null
    }

    return (
        <div className={cn('mdx', className)}>
            <MDXRemote {...mdxSource} components={components} />
        </div>
    )
}

const components = {
    img: IMG,
    Title,
    YouTube,
}
