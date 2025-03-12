'use client'

import { usePathname } from 'next/navigation'

import { Grid, Input, Layout, List, Preview, Readme, SortBy } from '.'

import { useDrive } from '®tanstack/query'
import { FolderEmpty, SearchEmpty, NotFound } from '®/ui/state'
import useLayout from '®/hooks/useLayout'
import Breadcrumb from '®/ui/breadcrumb'

export function Drive({ drive }: { drive: string }) {
    const {
        data,
        isLoading,
        query,
        setQuery,
        sort,
        selectedItem,
        open,
        setOpen,
        selectItem,
        ref,
        loadMore,
        focus,
        status,
        error,
    } = useDrive(drive)
    const { layout, hydrated } = useLayout()
    const path = usePathname()
    const title = path.split('/').pop()

    return (
        <div className='flex flex-col gap-4'>
            <Breadcrumb />
            <div className='flex space-x-1.5'>
                <Input
                    hotKey='/'
                    placeholder={error ? 'Oops, Page Not Found!' : `Search in ${title}`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <SortBy sort={sort} />
                <Layout />
            </div>
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
            <Readme slug={drive} />
            <div ref={ref} />
            {selectedItem && <Preview data={selectedItem} open={open} setOpen={setOpen} />}
        </div>
    )
}
