'use client'

import { useDrive } from '®/hooks/useDrive'
import Breadcrumb from '®/ui/breadcrumb'
import { FolderEmpty, NotFound, SearchEmpty } from '®/ui/state'
import useLayout from '®/hooks/useLayout'

import { Grid } from './grid'
import Input from './input'
import { Preview } from './preview'
import { SortBy } from './sort'
import Layout from './layout'
import { List } from './list'

export function Drive({ drive }: { drive: string }) {
    const {
        data,
        isLoading,
        query,
        setQuery,
        sort,
        selectedItem,
        isPreviewOpen,
        setPreviewOpen,
        onSelectItem,
    } = useDrive(drive)
    const { layout, hydrated } = useLayout()

    return (
        <div className='flex flex-col gap-4'>
            <Breadcrumb />
            <div className='flex gap-2'>
                <Input
                    hotKey='/'
                    placeholder='Thinking . . .'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <SortBy sort={sort} />
                <Layout />
            </div>
            {hydrated ? (
                data && Object.keys(data).length === 1 && data?.value.length === 0 ? (
                    <NotFound />
                ) : query.length > 0 && data?.value.length === 0 ? (
                    <SearchEmpty query={query} />
                ) : data?.value.length === 0 ? (
                    <FolderEmpty />
                ) : layout === 'Grid' ? (
                    <Grid data={data} isLoading={isLoading} onSelectItem={onSelectItem} />
                ) : (
                    <List data={data} isLoading={isLoading} onSelectItem={onSelectItem} />
                )
            ) : null}

            {selectedItem && (
                <Preview data={selectedItem} open={isPreviewOpen} setOpen={setPreviewOpen} />
            )}
        </div>
    )
}
