import React, { useEffect } from 'react'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type Item = {
    id: string
    title: string
    description?: string
    keywords?: string[]
    shortcut?: string[]
    icon?: string
    href?: string
    action?: {
        type: 'theme' | 'section' | 'toast' | 'custom'
        value: string
    }
    children?: Item[]
}
type SearchState = {
    query: string
    setQuery: (value: string) => void
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    ref: React.RefObject<HTMLDivElement>
    bounce: () => void
    page: string | null
    setPage: (id: string | null) => void
    tab: string
    setTab: (tab: string) => void
    onSelect: (
        item: Item,
        router?: { push: (href: string) => void },
        setTheme?: (theme: string) => void
    ) => void
    onKeyDown: (e: React.KeyboardEvent) => void

    shouldFilter: boolean
    setShouldFilter: (v: boolean) => void
}

export const useSearchStore = create<SearchState>()(
    devtools(
        (set, get) => {
            const ref = React.createRef<HTMLDivElement>()

            return {
                ref,
                query: '',
                setQuery: (value) => {
                    set({ query: value })
                },
                bounce: () => {
                    if (ref.current) {
                        ref.current.classList.remove('bounce')
                        void ref.current.offsetWidth
                        ref.current.classList.add('bounce')
                    }
                },
                page: null,
                setPage: (id: string | null) => set({ page: id }, false, 'setPage'),
                tab: 'actions',
                setTab: (tab: string) => set({ tab: tab }, false, 'setTab'),
                onSelect: (
                    item: Item,
                    router: { push: (href: string) => void },
                    setTheme: (theme: string) => void
                ) => {
                    if (item.action?.type === 'section' && item.children) {
                        get().setPage(item.id)
                        get().bounce()
                    } else if (item.href) {
                        router.push(item.href)
                        get().setOpen(false)
                    } else if (item.action?.type === 'theme') {
                        setTheme(item.action.value)
                        get().setOpen(false)
                    }
                },
                onKeyDown: (event: KeyboardEvent) => {
                    const { page, setPage, open, bounce, query } = get()

                    if (!open) return

                    switch (event.key) {
                        case 'Backspace':
                        case 'ArrowLeft':
                            if (page && query === '') {
                                event.preventDefault()
                                setPage(null)
                                bounce()
                            } else if (!page && query.length === 0) {
                                bounce()
                            }
                            break
                    }
                },
                shouldFilter: true,
                setShouldFilter: (v) => set({ shouldFilter: v }),
                open: false,
                setOpen: (value) =>
                    set((state) => {
                        const next =
                            typeof value === 'function'
                                ? (value as (prev: boolean) => boolean)(state.open)
                                : value

                        return { open: next }
                    }),
            }
        },
        { name: 'csearch-store' }
    )
)

export const useOpen = () => {
    const { open, setOpen } = useSearchStore()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                    event.preventDefault()
                    setOpen(true)
                }
                if (event.key === 'Escape') {
                    setOpen(false)
                }
            }

            document.addEventListener('keydown', handleKeyDown)

            return () => {
                document.removeEventListener('keydown', handleKeyDown)
            }
        }
    }, [])

    useEffect(() => {
        if (open && typeof window !== 'undefined') {
            document.documentElement.style.overflow = 'hidden'
            const isScrollable =
                document.documentElement.scrollHeight > document.documentElement.clientHeight

            document.documentElement.style.paddingRight = isScrollable ? '11px' : '0px'
        } else {
            document.documentElement.style.overflow = ''
            document.documentElement.style.paddingRight = ''
        }
    }, [open])

    return {
        open,
        setOpen,
    }
}

// 'use client'

// import type { NavigationType } from '@/config/navigation'

// import React from 'react'
// import { create } from 'zustand'
// import { devtools } from 'zustand/middleware'

// type NavigationGroups = Record<string, NavigationType[]>
// type WithContinuePropagation = { continuePropagation?: () => void }
// type SearchKeyboardEvent = (KeyboardEvent | React.KeyboardEvent) & WithContinuePropagation

// type SearchState = {
//     query: string
//     open: boolean
//     page: string | null
//     navigations: NavigationGroups | null
//     filteredGroups: [string, NavigationType[]][]
//     flatItems: NavigationType[]
//     activeIndex: number
//     ref: React.RefObject<HTMLDivElement>
//     heading: string | null
//     router?: { push: (href: string) => void }
//     setRouter: (router: { push: (href: string) => void }) => void
//     itemRefs: Record<string, React.RefObject<HTMLDivElement | null>>
//     setItemRef: (id: string, ref: React.RefObject<HTMLDivElement | null>) => void

//     bounce: () => void
//     setQuery: (value: string) => void
//     setOpen: (value: boolean | ((prev: boolean) => boolean)) => void
//     setPage: (value: string | null) => void
//     initialize: (data: NavigationGroups) => void
//     setActiveIndex: (index: number) => void

//     moveUp: () => void
//     moveDown: () => void
//     reset: () => void
//     executeActive: () => void
//     handleSelect: (item: NavigationType) => void
//     getGroups: () => NavigationGroups
//     getCurrentPageItems: () => NavigationType[]
//     handleKeyDown: (e: SearchKeyboardEvent) => void
//     applyFilter: () => void
//     scrollActiveItemIntoView: () => void
// }

// export const useSearchStore = create<SearchState>()(
//     devtools(
//         (set, get) => {
//             const ref = React.createRef<HTMLDivElement>()

//             return {
//                 query: '',
//                 open: false,
//                 page: null,
//                 navigations: null,
//                 filteredGroups: [],
//                 flatItems: [],
//                 activeIndex: -1,
//                 ref,
//                 heading: null,
//                 itemRefs: {},
//                 router: undefined,
//                 setRouter: (router) => set({ router }),
//                 setItemRef: (id, r) => {
//                     set((state) => ({
//                         itemRefs: { ...state.itemRefs, [id]: r },
//                     }))
//                 },

//                 bounce: () => {
//                     const el = get().ref.current

//                     if (!el) return
//                     el.style.transition = 'transform 120ms ease'
//                     el.style.transform = 'scale(0.96)'
//                     setTimeout(() => {
//                         if (el) el.style.transform = ''
//                     }, 120)
//                 },

//                 setQuery: (value) => {
//                     set({ query: value })
//                     get().applyFilter()
//                 },

//                 setOpen: (value) =>
//                     set((state) => {
//                         const next =
//                             typeof value === 'function'
//                                 ? (value as (prev: boolean) => boolean)(state.open)
//                                 : value

//                         if (next && state.flatItems.length > 0)
//                             return { open: true, activeIndex: 0 }

//                         return { open: next }
//                     }),

//                 setPage: (value) => {
//                     const { navigations } = get()

//                     if (!value || !navigations) return set({ page: value, heading: null })

//                     const allItems = Object.values(navigations).flat()
//                     const current = allItems.find((n) => n.id === value)

//                     set({ page: value, heading: current?.title ?? null })
//                 },

//                 scrollActiveItemIntoView: () => {
//                     const { activeIndex, flatItems, itemRefs } = get()

//                     if (activeIndex < 0 || !flatItems[activeIndex]) return
//                     const item = flatItems[activeIndex]
//                     const ref = itemRefs[item.id]

//                     if (ref?.current) {
//                         const el = ref.current

//                         el.scrollIntoView({ block: 'nearest' })
//                         const group = el.closest('[data-slot="search-group"]') as HTMLElement | null

//                         if (
//                             group &&
//                             group.parentElement &&
//                             group.offsetTop < group.parentElement.scrollTop
//                         ) {
//                             group.scrollIntoView({ block: 'start' })
//                         }
//                     }
//                 },
//                 initialize: (data) => {
//                     set({ navigations: data })
//                     get().applyFilter()
//                 },

//                 setActiveIndex: (index) => {
//                     const { flatItems } = get()

//                     if (flatItems.length === 0) return set({ activeIndex: -1 })
//                     set({ activeIndex: Math.max(0, Math.min(index, flatItems.length - 1)) })
//                 },

//                 moveUp: () => {
//                     const { activeIndex, flatItems } = get()

//                     if (flatItems.length === 0) return
//                     const next = (activeIndex - 1 + flatItems.length) % flatItems.length

//                     set({ activeIndex: next })
//                 },

//                 moveDown: () => {
//                     const { activeIndex, flatItems } = get()

//                     if (flatItems.length === 0) return
//                     const next = (activeIndex + 1) % flatItems.length

//                     set({ activeIndex: next })
//                 },

//                 reset: () => set({ activeIndex: -1, flatItems: [], filteredGroups: [] }),

//                 executeActive: () => {
//                     const { activeIndex, flatItems, handleSelect, router, setOpen } = get()

//                     if (activeIndex < 0 || flatItems.length === 0) return
//                     const selected = flatItems[activeIndex]

//                     if (!selected) return
//                     if (selected.href && router) router.push(selected.href)
//                     else if (selected.href) window.location.href = selected.href
//                     else handleSelect(selected)

//                     // Only close if not navigating to children
//                     if (!selected.children?.length) setOpen(false)
//                 },

//                 handleSelect: (item) => {
//                     const { setOpen, applyFilter, bounce } = get()

//                     item.onSelect?.()
//                     if (item.children?.length) {
//                         applyFilter()
//                         bounce()

//                         return
//                     }
//                     setOpen(false)
//                     applyFilter()
//                 },

//                 getGroups: () => get().navigations ?? {},
//                 getCurrentPageItems: () => {
//                     const { page, navigations } = get()

//                     if (!page || !navigations) return []
//                     const all = Object.values(navigations).flat()
//                     const current = all.find((n) => n.id === page)

//                     return current?.children ?? []
//                 },

//                 handleKeyDown: (event) => {
//                     const {
//                         moveUp,
//                         moveDown,
//                         executeActive,
//                         setOpen,
//                         open,
//                         setPage,
//                         applyFilter,
//                         page,
//                         query,
//                         bounce,
//                     } = get()

//                     if (!open) return

//                     switch (event.key) {
//                         case 'ArrowUp':
//                             event.preventDefault()
//                             event.continuePropagation?.()
//                             moveUp()
//                             break
//                         case 'ArrowDown':
//                             event.preventDefault()
//                             event.continuePropagation?.()
//                             moveDown()
//                             break
//                         case 'Enter':
//                         case 'Space':
//                         case 'ArrowRight':
//                             event.preventDefault()
//                             event.continuePropagation?.()
//                             executeActive()
//                             break
//                         case 'Escape':
//                             event.preventDefault()
//                             event.continuePropagation?.()
//                             setOpen(false)
//                             break
//                         case 'Backspace':
//                         case 'ArrowLeft':
//                             if (page && query === '') {
//                                 event.preventDefault()
//                                 event.continuePropagation?.()
//                                 setPage(null)
//                                 applyFilter()
//                                 bounce()
//                             } else if (!page && query.length === 0) bounce()
//                             break
//                     }
//                 },

//                 applyFilter: () => {
//                     const { query, navigations, page } = get()

//                     if (!navigations) return set({ filteredGroups: [], flatItems: [] })
//                     const allItems = page
//                         ? get().getCurrentPageItems()
//                         : Object.values(navigations).flat()
//                     const q = query.toLowerCase()
//                     const filteredGroups: [string, NavigationType[]][] = []

//                     if (!page) {
//                         Object.entries(navigations).forEach(([groupName, items]) => {
//                             const filtered = items.filter(
//                                 (item) =>
//                                     !q ||
//                                     item.title.toLowerCase().includes(q) ||
//                                     item.description?.toLowerCase().includes(q) ||
//                                     item.keywords?.some((k) => k.toLowerCase().includes(q))
//                             )

//                             filteredGroups.push([groupName, filtered])
//                         })
//                     } else {
//                         filteredGroups.push([
//                             page,
//                             allItems.filter(
//                                 (item) =>
//                                     !q ||
//                                     item.title.toLowerCase().includes(q) ||
//                                     item.description?.toLowerCase().includes(q) ||
//                                     item.keywords?.some((k) => k.toLowerCase().includes(q))
//                             ),
//                         ])
//                     }

//                     const flatItems = filteredGroups.flatMap(([_, items]) => items)

//                     set({ filteredGroups, flatItems })
//                 },
//             }
//         },
//         { name: 'search-store' }
//     )
// )

// export const useSearch = () => useSearchStore()

// let hotkeysInitialized = false

// export const enableSearchHotkeys = () => {
//     if (hotkeysInitialized || typeof window === 'undefined') return

//     const handleKeyDown = (event: KeyboardEvent) => {
//         if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
//             event.preventDefault()
//             useSearchStore.getState().setOpen(true)

//             return
//         }
//         if (event.key === 'Escape') {
//             useSearchStore.getState().setOpen(false)
//         }
//     }

//     window.addEventListener('keydown', handleKeyDown)
//     hotkeysInitialized = true
// }
