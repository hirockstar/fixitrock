export type LoginStep = 'phone' | 'otp' | 'details'

export type User = {
    id: string // uuid
    name: string
    username: string
    phone: string
    gender?: string | null
    dob?: string | null
    role: 'user' | 'shopkeeper' | string
    team_id?: number | null
    avatar_url?: string | null
    active: boolean
    created_at: string
    updated_at: string
}
