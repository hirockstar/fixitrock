'use client'

import { useDrive } from '®/hooks/useDrive'
import Breadcrumb from '®/ui/breadcrumb'
import { FolderEmpty, NotFound, SearchEmpty } from '®/ui/state'
import { Grid } from './grid'
import Input from './input'
import { Preview } from './preview'
import { SortBy } from './sort'
import Layout from './layout'
import useLayout from '®/hooks/useLayout'
import { List } from './list'

export function Drive({ drive }: { drive: string[] }) {
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
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                        isLoading
                            ? 'Thinking . . . '
                            : data?.name
                              ? `Search ${data?.name}`
                              : 'Oops, Page Not Found!'
                    }
                    hotKey='/'
                />
                <SortBy sort={sort} />
                <Layout />
            </div>
            {hydrated ? (
                data && Object.keys(data).length === 1 && data?.children?.length === 0 ? (
                    <NotFound />
                ) : query.length > 0 && data?.children?.length === 0 ? (
                    <SearchEmpty query={query} />
                ) : data?.children?.length === 0 ? (
                    <FolderEmpty />
                ) : layout === 'Grid' ? (
                    <Grid data={data} isLoading={isLoading} onSelectItem={onSelectItem} />
                ) : (
                    <List data={data} isLoading={isLoading} onSelectItem={onSelectItem} />
                )
            ) : null}

            {selectedItem && (
                <Preview open={isPreviewOpen} setOpen={setPreviewOpen} data={selectedItem} />
            )}
        </div>
    )
}
