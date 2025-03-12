'use client'

import { useReadme } from '®tanstack/query'
import Mdx from './preview/mdx'

export function Readme({ slug }: { slug: string }) {
    const { data: src } = useReadme(slug)

    if (!src) return null

    return (
        <div className='flex flex-col rounded-md border'>
            {/* <div className='flex items-center justify-between border-b p-2 pr-4'>
                <Button size='sm' startContent={<BookOpen size={20} />} variant='light'>
                    Readme
                </Button>
                <Button
                    isIconOnly
                    size='sm'
                    startContent={<TableOfContents size={20} />}
                    variant='light'
                />
            </div> */}
            <div className='p-4 sm:p-6'>
                <Mdx src={src} />
            </div>
        </div>
    )
}
