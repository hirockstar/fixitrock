export type Invoice = {
    id: string
    number: number
    product: string
    seller: string
    location: string
    created_at: string
}

export type InvoiceProduct = {
    id: string
    invoice_id: string
    name: string
    qty: number
    purchase_price: number
    price: number
    created_at: string
}
