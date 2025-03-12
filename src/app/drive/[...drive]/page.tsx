'use client'

import { useParams } from 'next/navigation'
import { useDrive } from '®tanstack/query'
import Breadcrumb from '®ui/breadcrumb'
import { Input, SortBy, SwitchLayout } from '../ui'

export default function Page() {
    const { drive } = useParams<{ drive: string[] }>()
    const path = drive.join('/')
    const { error, query, setQuery, sort } = useDrive(`/${path}`)
    const title = path.split('/').pop()
    return (
        <main className='flex flex-col gap-4'>
            <Breadcrumb />
            <div className='flex space-x-1.5'>
                <Input
                    hotKey='/'
                    placeholder={error ? 'Oops, Page Not Found!' : `Search in ${title}`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <SortBy sort={sort} />
                <SwitchLayout />
            </div>
        </main>
    )
}

// ;<div className='flex flex-col gap-4'>
//     <Breadcrumb />
//     <div className='flex space-x-1.5'>
//         <Input
//             hotKey='/'
//             placeholder={error ? 'Oops, Page Not Found!' : `Search in ${title}`}
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//         />
//         <SortBy sort={sort} />
//         <Layout />
//     </div>
//     {hydrated ? (
//         error ? (
//             <NotFound />
//         ) : query && data?.value?.length === 0 ? (
//             <SearchEmpty query={query} />
//         ) : status === 'empty' ? (
//             <FolderEmpty />
//         ) : layout === 'Grid' ? (
//             <Grid
//                 data={data}
//                 focus={focus}
//                 isLoading={isLoading}
//                 loadMore={loadMore}
//                 onSelect={selectItem}
//             />
//         ) : (
//             <List
//                 data={data}
//                 focus={focus}
//                 isLoading={isLoading}
//                 loadMore={loadMore}
//                 onSelect={selectItem}
//             />
//         )
//     ) : null}
//     <Readme slug={drive} />
//     <div ref={ref} />
//     {selectedItem && <Preview data={selectedItem} open={open} setOpen={setOpen} />}
// </div>