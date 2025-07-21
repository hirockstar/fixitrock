export type Product = {
    id: number
    user_id: string // uuid, references auth.users(id)
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

export type Products = Product[]

export type ProductsResult = {
    success: boolean
    products: Product[]
    canManage: boolean
    error?: string
}
