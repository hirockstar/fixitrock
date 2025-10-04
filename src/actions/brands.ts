'use server'

import type { Brands } from '@/types/brands'

import { revalidatePath, revalidateTag } from 'next/cache'
import { cache } from 'react'

import { logWarning, withErrorHandling } from '@/lib/utils'
import { createClient } from '@/supabase/server'

const userSession = withErrorHandling(async () => {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()

    if (!data) {
        throw new Error('Not authenticated')
    }

    try {
        const id = data.claims?.sub
        const { data: user, error } = await supabase.from('users').select('*').eq('id', id).single()

        if (error || !user) {
            throw new Error('User not found')
        }

        return user
    } catch {
        throw new Error('Authentication failed')
    }
})

const checkAuth = withErrorHandling(async () => {
    const user = await userSession()

    if (user.role !== 3) {
        throw new Error('Access denied: Admin role required')
    }

    return user
})

async function uploadBrandImage(
    brandName: string,
    imgUrl?: string
): Promise<{ img?: string; error?: string }> {
    const supabase = await createClient()
    const result: { img?: string; error?: string } = {}

    if (!imgUrl || !imgUrl.trim()) return result

    const brandSlug = brandName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    const brandFolder = `brands/${brandSlug}`

    try {
        let blob: Blob

        if (imgUrl.startsWith('data:')) {
            const response = await fetch(imgUrl)

            blob = await response.blob()
        } else {
            const response = await fetch(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })

            if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)
            blob = await response.blob()
            if (!blob.type.startsWith('image/')) throw new Error('URL does not return an image')
        }

        let extension = blob.type.split('/')[1] || 'png'

        if (extension.includes('+')) {
            extension = extension.split('+')[0]
        }
        if (!['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension)) {
            extension = 'png'
        }

        const file = new File([blob], `logo.${extension}`, { type: blob.type })
        const path = `${brandFolder}/logo.${extension}`

        const { error } = await supabase.storage.from('assets').upload(path, file, {
            cacheControl: '3600',
            upsert: true,
        })

        if (error) throw new Error(error.message)
        result.img = `/assets/${path}`
    } catch (error) {
        result.error = error instanceof Error ? error.message : String(error)
    }

    return result
}

async function deleteBrandImage(imgPath?: string): Promise<void> {
    if (!imgPath) return
    const supabase = await createClient()

    try {
        await supabase.storage.from('assets').remove([imgPath.replace(/^\/assets\//, '')])
    } catch (error) {
        logWarning('Failed to delete brand image:', error)
    }
}

export type BrandFormData = {
    name: string
    img: string
    description: string
}

export type BrandActionState = {
    success?: boolean
    message?: string
    errors?: {
        name?: string[]
        img?: string[]
        description?: string[]
        keywords?: string[]
        general?: string[]
    }
}

export const getAllBrands = cache(async function getAllBrands(): Promise<{
    data: Brands | null
    error: string | null
}> {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .order('name', { ascending: true })

        if (error) throw new Error(error.message)

        return { data: data as Brands, error: null }
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch brands',
        }
    }
})

export const addBrand = withErrorHandling(
    async (prevState: BrandActionState, formData: FormData): Promise<BrandActionState> => {
        await checkAuth()
        const supabase = await createClient()

        const name = (formData.get('name') ?? '') as string
        const imgUrl = (formData.get('img') ?? '') as string
        const description = (formData.get('description') ?? '') as string

        const errors: BrandActionState['errors'] = {}

        if (!name || name.trim().length === 0) errors.name = ['Brand name is required']
        else if (name.length > 255) errors.name = ['Brand name must be less than 255 characters']

        if (!imgUrl || imgUrl.trim().length === 0) errors.img = ['Brand image is required']

        if (description && description.length > 1000)
            errors.description = ['Description must be less than 1000 characters']

        if (Object.keys(errors).length > 0) return { errors }

        const { data: existingBrand } = await supabase
            .from('brands')
            .select('id')
            .eq('name', name.trim())
            .single()

        if (existingBrand) return { errors: { name: ['A brand with this name already exists'] } }

        const uploaded = await uploadBrandImage(name.trim(), imgUrl.trim())

        if (!uploaded.img) return { errors: { img: ['Failed to upload image'] } }

        const { error } = await supabase
            .from('brands')
            .insert({
                name: name.trim(),
                img: uploaded.img,
                description: description?.trim() || null,
            })
            .select()
            .single()

        if (error) return { errors: { general: [error.message] } }

        revalidatePath('/')
        revalidateTag('brands')

        return { success: true, message: 'Brand added successfully!' }
    }
)

export const editBrand = withErrorHandling(
    async (prevState: BrandActionState, formData: FormData): Promise<BrandActionState> => {
        await checkAuth()
        const supabase = await createClient()

        const id = (formData.get('id') ?? '') as string
        const name = (formData.get('name') ?? '') as string
        const imgUrl = (formData.get('img') ?? '') as string
        const description = (formData.get('description') ?? '') as string

        const errors: BrandActionState['errors'] = {}

        if (!id) errors.general = ['Brand ID is required']
        if (!name || name.trim().length === 0) errors.name = ['Brand name is required']
        else if (name.length > 255) errors.name = ['Brand name must be less than 255 characters']
        if (!imgUrl || imgUrl.trim().length === 0) errors.img = ['Brand image is required']
        if (description && description.length > 1000)
            errors.description = ['Description must be less than 1000 characters']

        if (Object.keys(errors).length > 0) return { errors }

        const { data: existingBrand } = await supabase
            .from('brands')
            .select('*')
            .eq('id', id)
            .single()

        if (!existingBrand) return { errors: { general: ['Brand not found'] } }

        const { data: nameExists } = await supabase
            .from('brands')
            .select('id')
            .eq('name', name.trim())
            .neq('id', id)
            .single()

        if (nameExists) return { errors: { name: ['A brand with this name already exists'] } }

        let finalImg = imgUrl.trim()

        if (imgUrl.trim()) {
            const uploaded = await uploadBrandImage(name.trim(), imgUrl.trim())

            if (uploaded.img) finalImg = uploaded.img
            else return { errors: { img: ['Failed to upload image'] } }

            if (existingBrand.img) await deleteBrandImage(existingBrand.img)
        }

        const { error } = await supabase
            .from('brands')
            .update({
                name: name.trim(),
                img: finalImg,
                description: description?.trim() || null,
            })
            .eq('id', id)
            .select()
            .single()

        if (error) return { errors: { general: [error.message] } }

        revalidatePath('/')
        revalidateTag('brands')

        return { success: true, message: 'Brand updated successfully!' }
    }
)

export const deleteBrand = withErrorHandling(
    async (prevState: BrandActionState, formData: FormData): Promise<BrandActionState> => {
        await checkAuth()
        const supabase = await createClient()
        const id = formData.get('id') as string

        if (!id) return { errors: { general: ['Brand ID is required'] } }

        const { data: brand, error: fetchError } = await supabase
            .from('brands')
            .select('id, img')
            .eq('id', parseInt(id))
            .single()

        if (fetchError)
            return { errors: { general: [`Failed to fetch brand: ${fetchError.message}`] } }

        try {
            if (brand?.img) await deleteBrandImage(brand.img)
        } catch (error) {
            logWarning('Error deleting brand image:', error)
        }

        const { error: deleteError } = await supabase.from('brands').delete().eq('id', parseInt(id))

        if (deleteError) return { errors: { general: [deleteError.message] } }

        revalidatePath('/')
        revalidateTag('brands')

        return { success: true, message: 'Brand deleted successfully!' }
    }
)

export const getBrandById = withErrorHandling(async (id: number) => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('brands').select('*').eq('id', id).single()

    if (error) throw new Error(error.message)

    return { data, error: null }
})
