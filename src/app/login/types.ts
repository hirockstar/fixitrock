export type LoginStep = 'phone' | 'otp' | 'details'

export type UserDetails = {
    name: string
    username: string
    phone: number
    gender: 'male' | 'female' | 'other'
    dob: Date
}
