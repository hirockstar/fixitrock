import { create } from 'zustand'

export type FilterValues = {
    categories: string[]
    brands: string[]
    status: string[]
}

type ActiveFilter = {
    id: string
    label: string
    onRemove: () => void
}

type FilterStore = {
    values: FilterValues
    toggleCategory: (category: string) => void
    toggleBrand: (brand: string) => void
    toggleStatus: (status: string) => void
    reset: () => void
    clearCategory: () => void
    clearBrand: () => void
    clearStatus: () => void
    getActiveFilters: (statusOptions: { key: string; label: string }[]) => ActiveFilter[]
}

const initial: FilterValues = { categories: [], brands: [], status: [] }

export const useProductFilterStore = create<FilterStore>((set, get) => ({
    values: initial,
    toggleCategory: (category) =>
        set((s) => ({
            values: {
                ...s.values,
                categories: s.values.categories.includes(category)
                    ? s.values.categories.filter((c) => c !== category)
                    : [...s.values.categories, category],
            },
        })),
    toggleBrand: (brand) =>
        set((s) => ({
            values: {
                ...s.values,
                brands: s.values.brands.includes(brand)
                    ? s.values.brands.filter((b) => b !== brand)
                    : [...s.values.brands, brand],
            },
        })),
    toggleStatus: (status) =>
        set((s) => ({
            values: {
                ...s.values,
                status: s.values.status.includes(status)
                    ? s.values.status.filter((st) => st !== status)
                    : [...s.values.status, status],
            },
        })),
    reset: () => set({ values: initial }),
    clearCategory: () => set((s) => ({ values: { ...s.values, categories: [] } })),
    clearBrand: () => set((s) => ({ values: { ...s.values, brands: [] } })),
    clearStatus: () => set((s) => ({ values: { ...s.values, status: [] } })),
    getActiveFilters: (statusOptions) => {
        const { values, toggleCategory, toggleBrand, toggleStatus } = get()
        const filters: ActiveFilter[] = []

        // Add category filters
        values.categories.forEach((category) => {
            filters.push({
                id: `category-${category}`,
                label: category,
                onRemove: () => toggleCategory(category),
            })
        })

        // Add brand filters
        values.brands.forEach((brand) => {
            filters.push({
                id: `brand-${brand}`,
                label: brand,
                onRemove: () => toggleBrand(brand),
            })
        })

        // Add status filters
        values.status.forEach((statusKey) => {
            const statusOption = statusOptions.find((option) => option.key === statusKey)

            if (statusOption) {
                filters.push({
                    id: `status-${statusKey}`,
                    label: statusOption.label,
                    onRemove: () => toggleStatus(statusKey),
                })
            }
        })

        return filters
    },
}))
