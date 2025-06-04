import { cookies } from 'next/headers'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { Navbar } from '®app/(space)/ui/navbar'
import { SortField, SortOrder } from '®types/drive'
import { GridSkeleton, ListSkeleton } from '®ui/skeleton'
import { siteConfig } from '®config/site'
import { getChildren, getReadme } from '®actions/drive'
import { Readme } from '®app/(space)/ui/preview'
import { Data } from './data'


type PageProps = {
    params: { space?: string[] }
    searchParams: {
        s?: string
        sort?: string
        order?: 'asc' | 'desc'
        layout?: 'grid' | 'list'
    }
}

export default async function Page(context: PageProps) {
    const params = await context.params
    const searchParams = await context.searchParams

    const space = (params.space ?? []).join('/')
    const query = searchParams.s ?? ''
    const validSortFields: SortField[] = ['name', 'type', 'size', 'lastModifiedDateTime']
    const isValidSort = (field: string): field is SortField =>
        validSortFields.includes(field as SortField)

    const sortField = isValidSort(searchParams.sort ?? '')
        ? (searchParams.sort as SortField)
        : undefined

    const sortOrder =
        sortField && searchParams.order === 'desc' ? 'desc' : sortField ? 'asc' : undefined

    const cookieStore = await cookies()
    let layout: 'grid' | 'list'

    if (searchParams.layout === 'list' || searchParams.layout === 'grid') {
        layout = searchParams.layout
    } else if (cookieStore.get('layout')?.value === 'list') {
        layout = 'list'
    } else {
        layout = 'grid'
    }

    return (
        <main className='flex flex-col'>
            <Navbar
                initialQuery={query}
                initialSortField={sortField}
                initialSortOrder={sortOrder}
                title={space}
            />

            <Suspense
                fallback={
                    layout === 'list' ? (
                        <div className='flex flex-col gap-2 px-2'>
                            <ListSkeleton />
                        </div>
                    ) : (
                        <div className='grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2 px-2 2xl:px-[2rem]'>
                            <GridSkeleton />
                        </div>
                    )
                }
            >
                <Space
                    layout={layout}
                    query={query}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    space={space}
                />
            </Suspense>
        </main>
    )
}
interface Props {
    space: string
    query: string
    sortField?: SortField
    sortOrder?: SortOrder
    layout: 'grid' | 'list'
}

async function Space({ space, ...props }: Props) {
    try {
        const initial = await getChildren(`/${space}`, undefined, 50)
        const raw = await getReadme(`/${space}`)

        return (
            <>
                <Data
                    initial={{ ...initial, nextPage: initial['@odata.nextLink'] }}
                    space={space}
                    {...props}
                />
                <Readme className='rounded-lg border p-2 2xl:px-[2rem]' raw={raw || ''} />
            </>
        )
    } catch (error) {
        // Check if it's a "resource not found" error
        if (error instanceof Error && error.message.includes('could not be found')) {
            notFound()
        }
        // Re-throw other errors
        throw error
    }
}
export async function generateMetadata({ params }: { params: Promise<{ space: string[] }> }) {
    const space = (await params).space
    const drivePath = space.join('/')
    const title = space[space.length - 1]

    return {
        title: title || 'Page Not Found',
        description: title || 'Not Found',
        keywords: title || 'Not Found',
        authors: [
            {
                name: 'Rock Star 💕',
                url: 'https://rockstar.bio',
            },
        ],
        publisher: 'Rock Star 💕',
        openGraph: {
            title: title || '',
            url: new URL(siteConfig.domain),
            type: 'website',
            images: `/space/og?slug=/${drivePath}`,
            siteName: siteConfig.title,
        },
    }
}
