'use client'
import { Snippet } from '@heroui/react'
import { ReactElement } from 'react'
import { MdOutlineContentCopy } from 'react-icons/md'
import CodeTitle from './codetitle'

interface CodeBlockProps {
    'data-language'?: string
}

const Pre = ({ children }: { children?: ReactElement<CodeBlockProps> }) => {
    const getClassName = () => {
        const language = children?.props['data-language']
        return language || ''
    }

    return (
        <main className='!rounded-md border border-border'>
            <div className='flex items-center justify-between bg-default/10 px-4 py-2 dark:bg-default/30'>
                {getClassName() && (
                    <div className='flex items-center'>
                        <CodeTitle lang={getClassName()} />
                    </div>
                )}
                <div className='flex flex-grow items-center justify-end'>
                    <Snippet
                        size='sm'
                        hideSymbol
                        classNames={{ base: '-p-1 bg-transparent', pre: 'hidden' }}
                        copyIcon={<MdOutlineContentCopy />}
                    >
                        {children}
                    </Snippet>
                </div>
            </div>
            <div className='border-b border-border' />
            <pre className='overflow-auto'>{children}</pre>
        </main>
    )
}

export default Pre
