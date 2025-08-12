'use client'

import type { DriveItem, SortField, SortOrder } from '@/types/drive'
import type { Drive } from '@/types/drive'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { getChildren } from '@/actions/drive'
import { getDriveItems } from '@/app/(space)/utils'
import { Grid } from '@/app/(space)/ui/grid'
import { List } from '@/app/(space)/ui/list'

interface Props {
    space: string
    layout: 'grid' | 'list'
    query: string
    sortField?: SortField
    sortOrder?: SortOrder
    initial: Drive & { nextPage?: string }
}

export function Data({ space, layout, query, sortField, sortOrder, initial }: Props) {
    const [items, setItems] = useState<DriveItem[]>(initial.value)
    const [nextPage, setNextPage] = useState<string | undefined>(initial.nextPage)
    const [loading, setLoading] = useState(false)

    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView && nextPage && !loading) {
            setLoading(true)

            getChildren(`/${space}`, nextPage, 50)
                .then((res) => {
                    setItems((prev) => [...prev, ...res.value])
                    setNextPage(res['@/odata.nextLink']) // nextPage for further pagination
                })
                .finally(() => setLoading(false))
        }
    }, [inView, nextPage, space, loading])

    const filteredData = getDriveItems({
        data: items,
        query,
        sortField,
        sortOrder,
    })

    const props = {
        data: { value: filteredData },
        loadMore: loading,
        ref,
    }

    return (
        <>
            {layout === 'list' ? <List {...props} /> : <Grid {...props} />}
            <div ref={ref} />
        </>
    )
}
