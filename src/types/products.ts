export type Product = {
    id: number
    createdBy: string
    slug: string
    name: string
    compatible: string
    description?: string
    img?: Record<string, unknown>
    purchase: number
    staff_price?: number
    price?: number
    qty: number
    category?: string
    brand?: string
    other?: Record<string, unknown>
    deleted_at?: string
    created_at?: string
    updated_at?: string
}
