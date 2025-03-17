import { useSearchParams } from 'next/navigation'

/**
 * Custom hook to safely parse query parameters.
 * Returns an instance of URLSearchParams that updates dynamically.
 */
export function useQueryParams() {
    return useSearchParams()
}
