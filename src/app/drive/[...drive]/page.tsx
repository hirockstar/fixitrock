'use client'

import { useParams, usePathname } from 'next/navigation'
import { Button, Navbar } from '@heroui/react'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { useDrive } from '®tanstack/query'
import useLayout from '®hooks/useLayout'
import { FolderEmpty, NotFound, SearchEmpty } from '®ui/state'

import { Grid, Input, List, SortBy, SwitchLayout } from '../ui'
import { ReadMe } from '../ui/preview/readme'
import { Preview } from '../ui/preview'

export default function Page() {
    const { drive } = useParams<{ drive: string[] }>()
    const pathname = usePathname()
    const path = drive.join('/')
    const {
        data,
        focus,
        isLoading,
        loadMore,
        selectItem,
        error,
        status,
        query,
        setQuery,
        sort,
        ref,
        open,
        setOpen,
        selectedItem,
    } = useDrive(`/${path}`)
    const { layout, hydrated } = useLayout()
    const title = path.split('/').pop()

    return (
        <main className='flex flex-col gap-2 p-1 md:px-4 2xl:px-[10%]'>
            <Navbar
                shouldHideOnScroll
                classNames={{
                    wrapper: 'h-auto w-full flex-col gap-1 p-0 py-1 sm:flex-row',
                }}
                maxWidth='full'
            >
                <div className='flex h-10 w-full select-none items-center gap-1.5'>
                    <Button
                        as={Link}
                        className='h-8 w-8 min-w-0 p-0'
                        href={`/${pathname.split('/').slice(1, -1).join('/')}`}
                        radius='full'
                        size='sm'
                        variant='light'
                    >
                        <ChevronLeft size={20} />
                    </Button>
                    <h1 className='text-base font-bold sm:text-lg'>{title}</h1>
                </div>
                <Input
                    end={
                        <div className='ml-0.5 flex items-center gap-0.5'>
                            <SwitchLayout />
                            <span className='text-xs text-muted-foreground'>|</span>
                            <SortBy sort={sort} />
                        </div>
                    }
                    hotKey='/'
                    placeholder={error ? 'Oops, Page Not Found!' : `Search in ${title}`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </Navbar>
            {hydrated ? (
                error ? (
                    <NotFound />
                ) : query && data?.value?.length === 0 ? (
                    <SearchEmpty query={query} />
                ) : status === 'empty' ? (
                    <FolderEmpty />
                ) : layout === 'Grid' ? (
                    <Grid
                        data={data}
                        focus={focus}
                        isLoading={isLoading}
                        loadMore={loadMore}
                        onSelect={selectItem}
                    />
                ) : (
                    <List
                        data={data}
                        focus={focus}
                        isLoading={isLoading}
                        loadMore={loadMore}
                        onSelect={selectItem}
                    />
                )
            ) : null}
            <div ref={ref} />
            <ReadMe className='rounded-lg border p-4 sm:p-6' slug={path} />
            {selectedItem && <Preview data={selectedItem} open={open} setOpen={setOpen} />}
        </main>
    )
}
