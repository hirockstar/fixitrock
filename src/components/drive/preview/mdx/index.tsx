'use client'

import { Player } from '@lottiefiles/react-lottie-player'
import matter from 'gray-matter'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { useEffect, useState } from 'react'

import { IMG, Title } from './components'

type MdxRemoteProps = {
    src: string
}

export default function Mdx({ src }: MdxRemoteProps) {
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAndProcessMdx = async () => {
            try {
                const response = await fetch(src)

                if (!response.ok) {
                    throw new Error(`Failed to fetch MDX content: ${response.statusText}`)
                }

                const rawContent = await response.text()
                const { content } = matter(rawContent)

                const serializedContent = await serialize(content, {
                    mdxOptions: {},
                })

                setMdxSource(serializedContent)
                setError(null)
            } catch (err) {
                setError((err as Error).message)
                setMdxSource(null)
            }
        }

        fetchAndProcessMdx()
    }, [src])

    if (error) {
        return <div className='flex h-[100px] flex-col items-center justify-center'>{error}</div>
    }

    if (!mdxSource) {
        return <Player autoplay loop className='h-52' src='/lottie/markdown.json' />
    }

    return (
        <div className='mdx'>
            <MDXRemote {...mdxSource} components={components} />
        </div>
    )
}

const components = {
    img: IMG,
    Title,
}
