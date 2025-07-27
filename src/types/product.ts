export interface Brand {
    id: number
    name: string
    description?: string
}

export interface SubCategory {
    id: number
    name: string
    description?: string
}

export interface Category {
    id: number
    name: string
    description?: string
    subCategories: SubCategory[]
}

export interface AttributeValue {
    id: string
    name: string
    hexColor?: string // For color attributes
}

export interface FilteringAttribute {
    id: number
    name: string
    type: 'select' | 'color' | 'size'
    values: AttributeValue[]
}

export interface PriceVariation {
    id: number
    attributes: { [attributeId: number]: string }
    purchasePrice: number
    staffPrice: number
    sellingPrice: number
    stock: number
}

export interface Product {
    id: number
    userId: string
    title: string
    slug: string
    description: string
    compatible: string
    image: JSON
    brandId: number
    categoryId: number
    subCategoryId: number
    purchasePrice: number
    staffPrice: number
    sellingPrice: number
    qty: number
    selectedAttributes?: { [attributeId: number]: string }
    priceVariations?: PriceVariation[]
    createdAt: string
    updatedAt: string
    deletedAt?: string
}
