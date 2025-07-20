export type LoginStep = 'phone' | 'otp' | 'details'

export type User = {
    id: string
    name: string
    username: string
    phone: string
    gender?: 'male' | 'female' | 'other'
    dob?: string | null
    role?: number
    avatar?: string | null
    active: boolean
    created_at: string
    updated_at: string
    bio?: string | null // max 160 chars
    location?: string | null
    location_url?: string | null
    cover?: string | null
    verified: boolean
}

export type TabsConfig = {
    title: string
    component: string
}
export type SlugConfig = {
    slug: string
    private?: boolean
    component: string
}

export type Navigation = {
    href: string
    icon: string
    title: string
    description?: string
}

export type Quotes = {
    id: number
    quote: string
    username: string
    lastModifiedDateTime?: string | null
}
