'use client'

import { Player } from '@lottiefiles/react-lottie-player'
import matter from 'gray-matter'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { useEffect, useState } from 'react'

import { IMG, Title, YouTube } from './components'
import { useReadme } from '®hooks/tanstack/query'
import { ErrorState } from '®ui/state'
import { SiMarkdown } from 'react-icons/si'

type ReadMeProps = {
    slug: string
}

export function ReadMe({ slug }: ReadMeProps) {
    const { data: src, error } = useReadme(`/${slug}`)
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
                console.error('MDX processing error:', err)
            }
        }

        fetchAndProcessMdx()
    }, [src])

    if (error) {
        return <ErrorState message={error.message} icons={[SiMarkdown]} />
    }

    if (!mdxSource) {
        return <Player autoplay loop className='h-52' src='/lottie/markdown.json' />
    }

    return (
        <div className='mdx rounded-md border p-4 sm:p-6'>
            <MDXRemote {...mdxSource} components={components} />
        </div>
    )
}

const components = {
    img: IMG,
    Title,
    YouTube,
}
