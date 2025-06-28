export type Product = {
    id: number
    createdBy: string
    slug: string
    name: string
    compatible: string
    description?: string
    img?: Array<string> | Array<{ url: string; alt?: string }>
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

export type ProductsResult = {
    success: boolean
    products: Product[]
    canManage: boolean
    error?: string
}
