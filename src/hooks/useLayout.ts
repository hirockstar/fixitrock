import { useEffect, useState } from 'react'

import useLocalStorage from './useLocalStorage'

export const layouts: Array<{ id: number; name: 'Grid' | 'List' }> = [
    { id: 1, name: 'List' },
    { id: 2, name: 'Grid' },
]

const DEFAULT_LAYOUT = layouts.find((l) => l.name === 'Grid')!.name

type Layout = 'Grid' | 'List'

function useLayout() {
    const [layout, setLayout] = useLocalStorage<Layout>('layout', DEFAULT_LAYOUT)
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        setHydrated(true)
    }, [])

    useEffect(() => {
        if (!layouts.some((l) => l.name === layout)) {
            setLayout(DEFAULT_LAYOUT)
        }
    }, [layout, setLayout])

    return { layout: hydrated ? layout : null, setLayout, hydrated }
}

export default useLayout
