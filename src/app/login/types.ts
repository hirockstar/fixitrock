export type LoginStep = 'phone' | 'otp' | 'details'

export type User = {
    id: string // uuid
    name: string
    username: string
    phone: string
    gender?: string | null
    dob?: string | null
    role?: number // bigint, now optional for login flow
    team_id?: number | null
    avatar?: string | null
    active: boolean
    created_at: string
    updated_at: string
    bio?: string | null // max 160 chars
    location?: string | null
    cover?: string | null
    verified: boolean
}

export type TabsConfig = {
    title: string
    component: string
}

export type Roles = {
    id: number
    role: string
    tabs?: TabsConfig[]
}

export type NavLink = {
    id: number
    title: string
    icon?: string // Lucide icon name, e.g., 'settings'
    href: string
    description?: string
    sort_order?: number
    active?: boolean
    role?: number | null // bigint or null
}

export type Quotes = {
    id: number
    quote: string
    username: string
    lastModifiedDateTime?: string | null
}
