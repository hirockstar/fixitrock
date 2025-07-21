export type Brand = {
    id: number
    name: string
    logo: {
        light?: string
        dark?: string
    } | null
    description: string
    created_at: string
    updated_at: string
}

export type Brands = Brand[]
