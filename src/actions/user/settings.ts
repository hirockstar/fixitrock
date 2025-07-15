'use server'

import { z } from 'zod'
import { revalidatePath, revalidateTag } from 'next/cache'

import { userSession } from '®actions/auth'
import { createClient } from '®supabase/server'
import { logWarning } from '®lib/utils'

const SettingsSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    gender: z.string().optional(),
    dob: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().max(160, 'Bio must be 160 characters or less').optional(),
})

export async function updateUser(formData: FormData) {
    const session = await userSession()
    const user = session.user

    if (!user) {
        throw new Error('Not authenticated')
    }
    const supabase = await createClient()

    try {
        const data = Object.fromEntries(formData.entries())
        const validatedData = SettingsSchema.parse(data)
        const { error } = await supabase
            .from('users')
            .update({
                name: validatedData.name,
                gender: validatedData.gender || null,
                dob: validatedData.dob ? new Date(validatedData.dob) : null,
                location: validatedData.location || null,
                bio: validatedData.bio || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        if (error) throw error
        revalidatePath('/[user]/[slug]/settings', 'layout')

        const { data: updatedUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

        if (fetchError) throw fetchError

        return { success: true, user: updatedUser }
    } catch (error) {
        logWarning('Error updating user:', error)
        throw new Error('Failed to update user')
    }
}

export async function uploadUserImage(file: File, type: 'avatar' | 'cover') {
    const session = await userSession()
    const user = session.user

    if (!user) {
        throw new Error('Not authenticated')
    }
    const supabase = await createClient()

    try {
        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        // Always use .png extension for storage
        const fileName = `${type}.png`
        const filePath = `user/@${user.username}/${fileName}`
        // Upload to Supabase Storage (always overwrite)
        const { error: uploadError } = await supabase.storage.from('user').upload(filePath, bytes, {
            contentType: 'image/png',
            upsert: true,
        })

        if (uploadError) throw uploadError
        // Get public URL
        const { data: urlData } = supabase.storage.from('user').getPublicUrl(filePath)
        // Update user table
        const updateData =
            type === 'avatar' ? { avatar: urlData.publicUrl } : { cover: urlData.publicUrl }
        const { error: updateError } = await supabase
            .from('users')
            .update({
                ...updateData,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        if (updateError) throw updateError
        revalidatePath('/[user]/[slug]')
        revalidateTag(`user-${user.username}`)

        return { url: urlData.publicUrl }
    } catch (error) {
        logWarning(`Error uploading ${type}:`, error)

        throw new Error(`Failed to upload ${type}`)
    }
}

export async function deleteUserImage(type: 'avatar' | 'cover') {
    const session = await userSession()
    const user = session.user

    if (!user) {
        throw new Error('Not authenticated')
    }
    const supabase = await createClient()

    try {
        const fileName = `${type}.png`
        const filePath = `user/@${user.username}/${fileName}`

        // Delete from storage
        const { error: deleteError } = await supabase.storage.from('user').remove([filePath])

        if (deleteError) throw deleteError

        // Remove from user table
        const updateData = type === 'avatar' ? { avatar: null } : { cover: null }
        const { error: updateError } = await supabase
            .from('users')
            .update({
                ...updateData,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        if (updateError) throw updateError

        revalidatePath('/[user]/[slug]', 'layout')
        revalidateTag(`user-${user.username}`)

        return { success: true }
    } catch (error) {
        logWarning(`Error deleting ${type}:`, error)

        throw new Error(`Failed to delete ${type}`)
    }
}

export async function updateSelfAvatar(file: File) {
    const session = await userSession()
    const user = session.user

    if (!user) {
        throw new Error('Not authenticated')
    }

    const supabase = await createClient()

    try {
        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        const fileName = 'avatar.png'
        const filePath = `user/@${user.username}/${fileName}`

        // Upload to Supabase Storage (always overwrite)
        const { error: uploadError } = await supabase.storage.from('user').upload(filePath, bytes, {
            contentType: 'image/png',
            upsert: true,
        })

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage.from('user').getPublicUrl(filePath)

        // Update user table
        const { error: updateError } = await supabase
            .from('users')
            .update({
                avatar: urlData.publicUrl,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        if (updateError) throw updateError
        revalidatePath('/[user]/[slug]')
        revalidateTag(`user-${user.username}`)

        return { url: urlData.publicUrl }
    } catch (error) {
        logWarning('Error uploading avatar:', error)
        throw new Error('Failed to upload avatar')
    }
}

export async function updateSelfCover(file: File) {
    const session = await userSession()
    const user = session.user

    if (!user) {
        throw new Error('Not authenticated')
    }

    const supabase = await createClient()

    try {
        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        const fileName = 'cover.png'
        const filePath = `user/@${user.username}/${fileName}`

        // Upload to Supabase Storage (always overwrite)
        const { error: uploadError } = await supabase.storage.from('user').upload(filePath, bytes, {
            contentType: 'image/png',
            upsert: true,
        })

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage.from('user').getPublicUrl(filePath)

        // Update user table
        const { error: updateError } = await supabase
            .from('users')
            .update({
                cover: urlData.publicUrl,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        if (updateError) throw updateError
        revalidatePath('/[user]/[slug]')
        revalidateTag(`user-${user.username}`)

        return { url: urlData.publicUrl }
    } catch (error) {
        logWarning('Error uploading cover:', error)
        throw new Error('Failed to upload cover')
    }
}

export async function removeSelfAvatar() {
    const session = await userSession()
    const user = session.user

    if (!user) {
        throw new Error('Not authenticated')
    }

    const supabase = await createClient()

    try {
        const fileName = 'avatar.png'
        const filePath = `user/@${user.username}/${fileName}`

        // Delete from storage
        const { error: deleteError } = await supabase.storage.from('user').remove([filePath])

        if (deleteError) throw deleteError

        // Remove from user table
        const { error: updateError } = await supabase
            .from('users')
            .update({
                avatar: null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        if (updateError) throw updateError
        revalidatePath('/[user]/[slug]', 'layout')
        revalidateTag(`user-${user.username}`)

        return { success: true }
    } catch (error) {
        logWarning('Error deleting avatar:', error)
        throw new Error('Failed to delete avatar')
    }
}

export async function removeSelfCover() {
    const session = await userSession()
    const user = session.user

    if (!user) {
        throw new Error('Not authenticated')
    }

    const supabase = await createClient()

    try {
        const fileName = 'cover.png'
        const filePath = `user/@${user.username}/${fileName}`

        // Delete from storage
        const { error: deleteError } = await supabase.storage.from('user').remove([filePath])

        if (deleteError) throw deleteError

        // Remove from user table
        const { error: updateError } = await supabase
            .from('users')
            .update({
                cover: null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        if (updateError) throw updateError
        revalidatePath('/[user]/[slug]', 'layout')
        revalidateTag(`user-${user.username}`)

        return { success: true }
    } catch (error) {
        logWarning('Error deleting cover:', error)
        throw new Error('Failed to delete cover')
    }
}
