import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { ProcessedCommand } from '@/config/search-commands'

interface SearchState {
    // Search state
    query: string
    searchResults: Record<string, ProcessedCommand[]> | null
    isLoading: boolean

    // Commands state
    commands: ProcessedCommand[]
    groupedCommands: Record<string, ProcessedCommand[]>

    // Navigation state
    pages: string[]
    activePage: string
    isHome: boolean

    // Actions
    setQuery: (query: string) => void
    clearQuery: () => void
    setCommands: (commands: ProcessedCommand[]) => void
    setLoading: (loading: boolean) => void
    navigateToPage: (pageName: string) => void
    popPage: () => void
    goHome: () => void

    // Search functions
    searchCommands: (query: string) => void
    getSearchResults: () => Record<string, ProcessedCommand[]> | null
}

export const useSearchStore = create<SearchState>()(
    devtools(
        (set, get) => ({
            // Initial state
            query: '',
            searchResults: null,
            isLoading: true,
            commands: [],
            groupedCommands: {},
            pages: ['home'],
            activePage: 'home',
            isHome: true,

            // Actions
            setQuery: (query: string) => {
                set({ query })
                if (query.trim()) {
                    get().searchCommands(query)
                } else {
                    set({ searchResults: null })
                }
            },

            clearQuery: () => {
                set({ query: '', searchResults: null })
            },

            setCommands: (commands: ProcessedCommand[]) => {
                // Group commands by category
                const grouped = commands.reduce(
                    (acc, cmd) => {
                        const category = cmd.id.split('-')[0] || 'general'

                        if (!acc[category]) {
                            acc[category] = []
                        }
                        acc[category].push(cmd)

                        return acc
                    },
                    {} as Record<string, ProcessedCommand[]>
                )

                set({
                    commands,
                    groupedCommands: grouped,
                    isLoading: false,
                })
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading })
            },

            navigateToPage: (pageName: string) => {
                set((state) => ({
                    pages: [...state.pages, pageName],
                    activePage: pageName,
                    isHome: false,
                }))
            },

            popPage: () => {
                set((state) => {
                    const newPages = [...state.pages]

                    newPages.splice(-1, 1)
                    const newActivePage = newPages[newPages.length - 1] || 'home'

                    return {
                        pages: newPages,
                        activePage: newActivePage,
                        isHome: newActivePage === 'home',
                    }
                })
            },

            goHome: () => {
                set({
                    pages: ['home'],
                    activePage: 'home',
                    isHome: true,
                })
            },

            // Search functions
            searchCommands: (query: string) => {
                const { commands } = get()

                if (!query.trim()) {
                    set({ searchResults: null })

                    return
                }

                const results: Record<string, ProcessedCommand[]> = {}
                const queryLower = query.toLowerCase()

                commands.forEach((cmd) => {
                    const category = cmd.id.split('-')[0] || 'general'

                    // Check if main command matches search
                    if (
                        cmd.title.toLowerCase().includes(queryLower) ||
                        cmd.description.toLowerCase().includes(queryLower)
                    ) {
                        if (!results[category]) results[category] = []
                        results[category].push(cmd)
                    }

                    // Check if children match search
                    if (cmd.children && cmd.children.length > 0) {
                        const matchingChildren = cmd.children.filter(
                            (child) =>
                                child.title.toLowerCase().includes(queryLower) ||
                                child.description.toLowerCase().includes(queryLower)
                        )

                        if (matchingChildren.length > 0) {
                            if (!results[category]) results[category] = []
                            // Add children with parent context
                            matchingChildren.forEach((child) => {
                                results[category].push({
                                    ...child,
                                    title: `${cmd.title} > ${child.title}`,
                                    description: `${child.description} (from ${cmd.title})`,
                                })
                            })
                        }
                    }
                })

                set({ searchResults: results })
            },

            getSearchResults: () => {
                return get().searchResults
            },
        }),
        {
            name: 'search-store',
        }
    )
)
