import { z } from 'zod'

export const UserPropsSchema = z.object({
    name: z.string(),
    username: z.string(),
    bio: z.string(),
    location: z.string(),
    birthdate: z.string(),
    gender: z.string(),
    number: z.string(),
    followers: z.number(),
    following: z.number(),
})

export type UserProps = z.infer<typeof UserPropsSchema>

export const GallerySchema = z.object({
    name: z.string(),
    thumbnail: z.string().url(),
})

export type GalleryProps = z.infer<typeof GallerySchema>

export type Quote = {
    id: number
    quote: string
    username: string
    lastModifiedDateTime: string
}
