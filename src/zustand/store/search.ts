import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useEffect, Dispatch, SetStateAction } from 'react'

import { CommandType } from '@/config/navigation'

interface NavigationGroup {
    heading: string
    navigationItems: CommandType[]
}

interface SearchBarState {
    // State
    query: string
    pages: string | null
    dynamicNavigations: Record<string, CommandType[]> | null
    open: boolean

    // Actions
    setQuery: (query: string) => void
    setPages: (pages: string | null) => void
    setDynamicNavigations: (navigations: Record<string, CommandType[]>) => void
    setOpen: Dispatch<SetStateAction<boolean>>

    // Methods
    bounce: (ref: React.RefObject<HTMLDivElement | null>) => void
    onKeyDown: (e: KeyboardEvent) => void
    popPage: () => void
    getFilteredItems: (items: CommandType[]) => CommandType[]
    initializeStore: (navigations: Record<string, CommandType[]>) => void
    handleSelect: (item: CommandType) => void

    // New rendering methods
    getNavigationGroups: () => NavigationGroup[]
    isPageMode: () => boolean
    getCurrentPageItems: () => CommandType[]
}

export const useSearchStore = create<SearchBarState>()(
    devtools(
        (set, get) => ({
            // Initial state
            query: '',
            pages: null,
            dynamicNavigations: null,
            open: false,

            // Actions
            setQuery: (query: string) => set({ query }),
            setPages: (pages: string | null) => set({ pages }),
            setDynamicNavigations: (navigations: Record<string, CommandType[]>) =>
                set({ dynamicNavigations: navigations }),
            setOpen: (value: SetStateAction<boolean>) => {
                const newValue = typeof value === 'function' ? value(get().open) : value

                set({ open: newValue })
            },

            // Methods
            bounce: (ref: React.RefObject<HTMLDivElement | null>) => {
                const { setQuery } = get()

                if (ref.current) {
                    ref.current.style.transform = 'scale(0.96)'
                    setTimeout(() => {
                        if (ref.current) {
                            ref.current.style.transform = ''
                        }
                    }, 100)
                    setQuery('')
                }
            },

            onKeyDown: (e: KeyboardEvent) => {
                const { query, popPage } = get()

                if (query.length) {
                    return
                }

                if (e.key === 'Backspace') {
                    e.preventDefault()
                    popPage()
                }
            },

            popPage: () => set({ pages: null }),

            getFilteredItems: (items: CommandType[]) => {
                const { query } = get()

                if (!query.trim()) {
                    return items
                }

                const searchQuery = query.toLowerCase()

                return items.filter((item) => {
                    const itemMatches =
                        item.title.toLowerCase().includes(searchQuery) ||
                        item.description?.toLowerCase().includes(searchQuery)

                    const childrenMatch = item.children?.some(
                        (child) =>
                            child.title.toLowerCase().includes(searchQuery) ||
                            child.description?.toLowerCase().includes(searchQuery)
                    )

                    return itemMatches || childrenMatch
                })
            },

            initializeStore: (navigations: Record<string, CommandType[]>) => {
                set({ dynamicNavigations: navigations })
            },

            handleSelect: (item: CommandType) => {
                const { setOpen } = get()

                // Check if the item has setPages action (like theme selection)
                if (item.onSelect && item.onSelect.toString().includes('setPages')) {
                    // Don't close for setPages actions
                    item.onSelect()
                } else {
                    // Close for href items and other actions like setTheme
                    setOpen(false)
                    item.onSelect?.()
                }
            },

            // New rendering methods
            isPageMode: () => {
                const { pages } = get()

                return pages !== null
            },

            getCurrentPageItems: () => {
                const { pages, dynamicNavigations } = get()

                if (!pages || !dynamicNavigations) return []

                const allItems = Object.values(dynamicNavigations).flat()
                const currentPageItem = allItems.find((item) => item.id === pages)

                return currentPageItem?.children || []
            },

            getNavigationGroups: () => {
                const { query, pages, dynamicNavigations } = get()

                // Page mode - show children of current page
                if (pages && dynamicNavigations) {
                    const allItems = Object.values(dynamicNavigations).flat()
                    const currentPageItem = allItems.find((item) => item.id === pages)
                    const children = currentPageItem?.children || []

                    return [
                        {
                            heading: pages,
                            navigationItems: children,
                        },
                    ]
                }

                // Normal/Filter mode - show all navigation groups
                if (!dynamicNavigations) return []

                const groups: NavigationGroup[] = []
                const allNavigationItems: CommandType[] = []

                Object.entries(dynamicNavigations).forEach(([heading, items]) => {
                    const filteredItems = get().getFilteredItems(items)

                    if (filteredItems.length > 0) {
                        const navigationItems: CommandType[] = []

                        filteredItems.forEach((item) => {
                            // Add the main item only if it doesn't exist anywhere
                            if (!allNavigationItems.some((navItem) => navItem.id === item.id)) {
                                navigationItems.push(item)
                                allNavigationItems.push(item)
                            }

                            // If searching, also add matching children
                            if (query.trim() && item.children) {
                                const matchingChildren = item.children.filter((child) => {
                                    const childMatches =
                                        child.title.toLowerCase().includes(query.toLowerCase()) ||
                                        child.description
                                            ?.toLowerCase()
                                            .includes(query.toLowerCase())

                                    return childMatches
                                })

                                // Add children only if they don't exist anywhere
                                matchingChildren.forEach((child) => {
                                    if (
                                        !allNavigationItems.some(
                                            (navItem) => navItem.id === child.id
                                        )
                                    ) {
                                        navigationItems.push(child)
                                        allNavigationItems.push(child)
                                    }
                                })
                            }
                        })

                        if (navigationItems.length > 0) {
                            groups.push({
                                heading,
                                navigationItems,
                            })
                        }
                    }
                })

                return groups
            },
        }),
        {
            name: 'search-bar-store',
        }
    )
)

// Hook for easier usage
export const useSearchBar = () => {
    const open = useSearchStore((state) => state.open)
    const setOpen = useSearchStore((state) => state.setOpen)

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
    }, [setOpen])

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
        // State
        query: useSearchStore((state) => state.query),
        pages: useSearchStore((state) => state.pages),
        dynamicNavigations: useSearchStore((state) => state.dynamicNavigations),
        open,
        setOpen,

        // Actions
        setQuery: useSearchStore((state) => state.setQuery),
        setPages: useSearchStore((state) => state.setPages),
        setDynamicNavigations: useSearchStore((state) => state.setDynamicNavigations),

        // Methods
        bounce: useSearchStore((state) => state.bounce),
        onKeyDown: useSearchStore((state) => state.onKeyDown),
        popPage: useSearchStore((state) => state.popPage),
        getFilteredItems: useSearchStore((state) => state.getFilteredItems),
        handleSelect: useSearchStore((state) => state.handleSelect),

        // New rendering methods
        getNavigationGroups: useSearchStore((state) => state.getNavigationGroups),
        isPageMode: useSearchStore((state) => state.isPageMode),
        getCurrentPageItems: useSearchStore((state) => state.getCurrentPageItems),
    }
}
