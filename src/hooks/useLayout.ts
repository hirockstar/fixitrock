'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

export type Layout = 'grid' | 'list'

const DEFAULT_LAYOUT: Layout = 'grid'

function useLayout() {
    const [layout, setLayoutState] = useState<Layout>(DEFAULT_LAYOUT)

    useEffect(() => {
        const cookieLayout = Cookies.get('layout') as Layout | undefined

        if (cookieLayout === 'grid' || cookieLayout === 'list') {
            setLayoutState(cookieLayout)
        } else {
            Cookies.set('layout', DEFAULT_LAYOUT, { expires: 365 })
            setLayoutState(DEFAULT_LAYOUT)
        }
    }, [])

    const setLayout = (newLayout: Layout) => {
        Cookies.set('layout', newLayout, { expires: 365 })
        setLayoutState(newLayout)
    }

    return { layout, setLayout }
}

export default useLayout
