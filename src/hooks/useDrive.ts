'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter as route, usePathname } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getChildren } from '®actions/drive/children'
import { getDownloadUrl, isFolder, isPreviewable, sanitizeQuery } from '®/lib/utils'
import { Drive, DriveItem, SortField, SortOrder } from '®/types/drive'
import { useQueryParams } from './useQueryParams'

export function useDrive(slugPath: string[]) {
    const [query, setQuery] = useState('')
    const [sortField, setSortField] = useState<SortField>('name')
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
    const [selectedItem, setSelectedItem] = useState<DriveItem | null>(null)
    const [isPreviewOpen, setPreviewOpen] = useState(false)

    const router = useRouter()
    const preview = route()
    const pathname = usePathname()
    const searchParams = useQueryParams()
    const slug = slugPath.join('/')

    const { data, isLoading, isError } = useQuery<Drive>({
        queryKey: ['Drive', slug],
        queryFn: () => getChildren(slug),
        staleTime: 60 * 1000,
    })

    const sanitizedQuery = useMemo(() => sanitizeQuery(query), [query])

    const filteredChildren = useMemo(() => {
        if (!data?.children) return []
        return data.children.filter((child) => {
            const itemNameTokens = sanitizeQuery(child.name)
            return sanitizedQuery.every((token) =>
                itemNameTokens.some((namePart) => namePart.includes(token))
            )
        })
    }, [data?.children, sanitizedQuery])

    const sortedChildren = useMemo(() => {
        return [...filteredChildren].sort((a, b) => {
            const getFieldValue = (item: DriveItem, field: SortField) =>
                field === 'lastModifiedDateTime' ? new Date(item[field] || '') : item[field] || ''

            const fieldA = getFieldValue(a, sortField)
            const fieldB = getFieldValue(b, sortField)

            let comparison = 0
            if (fieldA > fieldB) comparison = 1
            if (fieldA < fieldB) comparison = -1

            return sortOrder === 'asc' ? comparison : -comparison
        })
    }, [filteredChildren, sortField, sortOrder])

    const getHref = useCallback((item: DriveItem): string => {
        const path =
            item?.parentReference?.path?.replace('/drive/root:/RDRIVE', '').replace(/\/$/, '') || ''
        if (isFolder(item)) {
            return `${path}/${item.name}`
        }
        if (isPreviewable(item)) {
            return `${path}/?view=${item.name}`
        }
        return getDownloadUrl(item) || ''
    }, [])

    const childrenWithHref = useMemo(() => {
        return sortedChildren.map((child) => ({
            ...child,
            href: getHref(child),
        }))
    }, [sortedChildren, getHref])

    const filteredAndSortedData: Drive | undefined = data
        ? { ...data, children: childrenWithHref }
        : undefined

    const sort = (field: SortField, order: SortOrder) => {
        setSortField(field)
        setSortOrder(order)
    }

    const handlePreviewClose = () => {
        setPreviewOpen(false)
        preview.push(pathname, { scroll: false })
    }

    const onSelectItem = (item: DriveItem) => {
        setSelectedItem(item)

        if (isFolder(item)) {
            router.push(getHref(item))
        } else if (isPreviewable(item)) {
            preview.push(getHref(item), { scroll: false })
            setPreviewOpen(true)
        } else {
            const downloadUrl = getDownloadUrl(item)
            if (downloadUrl) window.location.href = downloadUrl
        }
    }

    useEffect(() => {
        if (!searchParams) return

        const viewFileName = searchParams.get('view')
        if (viewFileName) {
            const itemToPreview = data?.children?.find((child) => child.name === viewFileName)
            if (itemToPreview && isPreviewable(itemToPreview)) {
                setSelectedItem(itemToPreview)
                setPreviewOpen(true)
                preview.push(getHref(itemToPreview), { scroll: false })
            }
        }
    }, [data, searchParams, preview, getHref])

    return {
        data: filteredAndSortedData,
        isLoading,
        isError,
        query,
        setQuery,
        sort,
        selectedItem,
        setSelectedItem,
        isPreviewOpen,
        setPreviewOpen: handlePreviewClose,
        onSelectItem,
    }
}
