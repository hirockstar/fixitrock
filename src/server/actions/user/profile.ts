'use server'

import { z } from 'zod'

import { logWarning } from '®/lib/utils'
import { DriveClient } from '®/lib/utils/DriveClient'

const ProfileItemSchema = z.object({
    name: z.string(),
    '@microsoft.graph.downloadUrl': z.string().url(),
})

const ProfileSchema = z.object({
    user: z.object({
        avatar: z.string().url(),
        cover: z.string().url(),
    }),
})

export async function getProfile(username: string) {
    const client = await DriveClient()

    if (!client) throw new Error('DriveClient initialization failed')

    try {
        const response = await client.api(`/me/drive/root:/user/${username}:/children`).get()

        const files = z.array(ProfileItemSchema).parse(response.value)

        const avatar = files.find((item) => item.name === 'avatar.png')
        const cover = files.find((item) => item.name === 'cover.png')

        const profile = {
            user: {
                avatar: avatar?.['@microsoft.graph.downloadUrl'] || '',
                cover: cover?.['@microsoft.graph.downloadUrl'] || '',
            },
        }

        ProfileSchema.parse(profile)

        return profile
    } catch (error: unknown) {
        logWarning(`Failed to get profile for ${username}`)
        throw error
    }
}
