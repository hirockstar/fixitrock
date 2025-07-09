'use server'

import type { Brand } from '®types/brands'

import { revalidatePath, revalidateTag } from 'next/cache'
import { cache } from 'react'
import { cookies } from 'next/headers'

import { adminAuth } from '®firebase/admin'
import { logWarning } from '®lib/utils'
import { createClient } from '®supabase/server'

// Helper function to check if user is authenticated
async function checkAuth() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (!token) {
        throw new Error('Not authenticated')
    }

    try {
        await adminAuth.verifyIdToken(token)

        return true
    } catch {
        throw new Error('Authentication failed')
    }
}

// Helper function to upload brand logos to Supabase Storage
async function uploadBrandLogos(
    brandName: string,
    lightLogoUrl?: string,
    darkLogoUrl?: string
): Promise<{ lightLogoUrl?: string; darkLogoUrl?: string; error?: string }> {
    const supabase = await createClient()
    const result: { lightLogoUrl?: string; darkLogoUrl?: string; error?: string } = {}

    // Create brand folder name (slugified)
    const brandSlug = brandName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    const brandFolder = `assets/brands/${brandSlug}`

    // Helper function to download and upload image
    async function downloadAndUploadImage(url: string, filename: string): Promise<string | null> {
        try {
            // Validate URL format first
            if (!url || !url.trim()) {
                throw new Error('Invalid URL provided')
            }

            // Check if URL points to an image file
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
            const urlLower = url.toLowerCase()
            const hasImageExtension = imageExtensions.some((ext) => urlLower.includes(`.${ext}`))

            if (!hasImageExtension) {
                throw new Error('URL does not appear to point to an image file')
            }

            // Download the image from URL
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; ImageDownloader/1.0)',
                },
            })

            if (!response.ok) {
                throw new Error(`Failed to download image: ${response.statusText}`)
            }

            // Check if response is actually an image
            const contentType = response.headers.get('content-type')

            if (!contentType || !contentType.startsWith('image/')) {
                throw new Error(`URL does not return an image. Content-Type: ${contentType}`)
            }

            const blob = await response.blob()

            // Validate blob is actually an image
            if (!blob.type.startsWith('image/')) {
                throw new Error(`Downloaded content is not an image. Type: ${blob.type}`)
            }

            // Determine file extension from URL or blob type
            let extension = 'svg'

            if (url.includes('.')) {
                const urlParts = url.split('.')
                const possibleExt = urlParts[urlParts.length - 1].split('?')[0].toLowerCase()

                if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(possibleExt)) {
                    extension = possibleExt
                }
            } else if (blob.type) {
                const mimeToExt: Record<string, string> = {
                    'image/jpeg': 'jpg',
                    'image/jpg': 'jpg',
                    'image/png': 'png',
                    'image/gif': 'gif',
                    'image/webp': 'webp',
                    'image/svg+xml': 'svg',
                }

                extension = mimeToExt[blob.type] || 'svg'
            }

            const file = new File([blob], `${filename}.${extension}`, { type: blob.type })

            const path = `${brandFolder}/${filename}.${extension}`
            const { error } = await supabase.storage.from('assets').upload(path, file, {
                cacheControl: '3600',
                upsert: true,
            })

            if (error) {
                throw new Error(`Failed to upload ${filename}: ${error.message}`)
            }

            const publicUrlData = supabase.storage.from('assets').getPublicUrl(path)

            return publicUrlData.data.publicUrl
        } catch (error) {
            const errorMessage =
                error instanceof Error ? `${error.message}\n${error.stack}` : String(error)

            result.error = `Error processing ${filename} from URL ${url}: ${errorMessage}`

            return null
        }
    }

    // Upload light logo if provided
    if (lightLogoUrl && lightLogoUrl.trim()) {
        if (lightLogoUrl.startsWith('data:')) {
            // Handle base64 data URL
            const response = await fetch(lightLogoUrl)
            const blob = await response.blob()
            const file = new File([blob], 'light.svg', { type: 'image/svg+xml' })

            const lightPath = `${brandFolder}/light.svg`
            const { error: lightError } = await supabase.storage
                .from('assets')
                .upload(lightPath, file, {
                    cacheControl: '3600',
                    upsert: true,
                })

            if (!lightError) {
                const publicUrlData = supabase.storage.from('assets').getPublicUrl(lightPath)

                result.lightLogoUrl = publicUrlData.data.publicUrl
            }
        } else if (lightLogoUrl.startsWith('http')) {
            // Download from URL and upload to Supabase
            const uploadedUrl = await downloadAndUploadImage(lightLogoUrl, 'light')

            if (uploadedUrl) {
                result.lightLogoUrl = uploadedUrl
            }
        }
    }

    // Upload dark logo if provided
    if (darkLogoUrl && darkLogoUrl.trim()) {
        if (darkLogoUrl.startsWith('data:')) {
            // Handle base64 data URL
            const response = await fetch(darkLogoUrl)
            const blob = await response.blob()
            const file = new File([blob], 'dark.svg', { type: 'image/svg+xml' })

            const darkPath = `${brandFolder}/dark.svg`
            const { error: darkError } = await supabase.storage
                .from('assets')
                .upload(darkPath, file, {
                    cacheControl: '3600',
                    upsert: true,
                })

            if (!darkError) {
                const publicUrlData = supabase.storage.from('assets').getPublicUrl(darkPath)

                result.darkLogoUrl = publicUrlData.data.publicUrl
            }
        } else if (darkLogoUrl.startsWith('http')) {
            // Download from URL and upload to Supabase
            const uploadedUrl = await downloadAndUploadImage(darkLogoUrl, 'dark')

            if (uploadedUrl) {
                result.darkLogoUrl = uploadedUrl
            }
        }
    }

    // If only one logo was uploaded, use it for both light and dark
    if (result.lightLogoUrl && !result.darkLogoUrl) {
        result.darkLogoUrl = result.lightLogoUrl
    } else if (result.darkLogoUrl && !result.lightLogoUrl) {
        result.lightLogoUrl = result.darkLogoUrl
    }

    return result
}

// Helper function to delete specific brand logos from Supabase Storage
async function deleteBrandLogos(
    brandName: string,
    options: { light?: boolean; dark?: boolean } = {}
): Promise<void> {
    const supabase = await createClient()
    // Create brand folder name (slugified)
    const brandSlug = brandName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    const brandFolder = `assets/brands/${brandSlug}`
    const toDelete: string[] = []

    if (options.light) toDelete.push(`${brandFolder}/light.svg`)
    if (options.dark) toDelete.push(`${brandFolder}/dark.svg`)
    if (toDelete.length === 0) return
    try {
        const { error: deleteError } = await supabase.storage.from('assets').remove(toDelete)

        if (deleteError) {
            throw new Error(`Failed to delete files: ${deleteError.message}`)
        }
    } catch (error) {
        // Log error but don't fail the operation
        const errorMessage = error instanceof Error ? error.message : String(error)

        throw new Error(`Failed to delete brand logos: ${errorMessage}`)
    }
}

export type BrandFormData = {
    name: string
    logo: {
        light: string
        dark: string
    }
    description: string
}

export type BrandActionState = {
    success?: boolean
    message?: string
    errors?: {
        name?: string[]
        logo_light?: string[]
        logo_dark?: string[]
        description?: string[]
        general?: string[]
    }
}

// Get all brands (cached, tag: 'brands')
export const getAllBrands = cache(async function getAllBrands(): Promise<{
    data: Brand[] | null
    error: string | null
}> {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .order('name', { ascending: true })

        if (error) {
            throw new Error(error.message)
        }

        return { data: data as Brand[], error: null }
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch brands',
        }
    }
})

// Add new brand
export async function addBrand(
    prevState: BrandActionState,
    formData: FormData
): Promise<BrandActionState> {
    try {
        await checkAuth()
        const supabase = await createClient()

        // Extract form data
        const name = (formData.get('name') ?? '') as string
        const logo_light = (formData.get('logo_light') ?? '') as string
        const logo_dark = (formData.get('logo_dark') ?? '') as string
        const description = (formData.get('description') ?? '') as string

        // Validation
        const errors: BrandActionState['errors'] = {}

        if (!name || name.trim().length === 0) {
            errors.name = ['Brand name is required']
        } else if (name.length > 255) {
            errors.name = ['Brand name must be less than 255 characters']
        }

        // Make both logos optional - at least one should be provided
        if (!logo_light || logo_light.trim().length === 0) {
            if (!logo_dark || logo_dark.trim().length === 0) {
                errors.logo_light = ['At least one logo (light or dark) is required']
                errors.logo_dark = ['At least one logo (light or dark) is required']
            }
        }

        if (description && description.length > 1000) {
            errors.description = ['Description must be less than 1000 characters']
        }

        if (Object.keys(errors).length > 0) {
            return { errors }
        }

        // Check if brand name already exists
        const { data: existingBrand } = await supabase
            .from('brands')
            .select('id')
            .eq('name', name.trim())
            .single()

        if (existingBrand) {
            return {
                errors: {
                    name: ['A brand with this name already exists'],
                },
            }
        }

        // Upload logos if provided
        let finalLightLogo = logo_light.trim()
        let finalDarkLogo = logo_dark.trim()

        // If only one logo is provided, use it for both light and dark
        if (logo_light.trim() && !logo_dark.trim()) {
            finalDarkLogo = logo_light.trim()
        } else if (logo_dark.trim() && !logo_light.trim()) {
            finalLightLogo = logo_dark.trim()
        }

        if (logo_light.trim() || logo_dark.trim()) {
            const uploadedLogos = await uploadBrandLogos(
                name.trim(),
                logo_light.trim(),
                logo_dark.trim()
            )

            if (uploadedLogos.lightLogoUrl) {
                finalLightLogo = uploadedLogos.lightLogoUrl
            }
            if (uploadedLogos.darkLogoUrl) {
                finalDarkLogo = uploadedLogos.darkLogoUrl
            }
        }

        // Create logo JSONB object
        const logoObject = {
            light: finalLightLogo,
            dark: finalDarkLogo,
        }

        // Insert new brand
        const { error } = await supabase
            .from('brands')
            .insert({
                name: name.trim(),
                logo: logoObject,
                description: description?.trim() || null,
            })
            .select()
            .single()

        if (error) {
            return {
                errors: {
                    general: [error.message],
                },
            }
        }

        revalidatePath('/')
        revalidateTag('brands') // Invalidate brands cache

        return {
            success: true,
            message: 'Brand added successfully!',
        }
    } catch (error) {
        return {
            errors: {
                general: [
                    error instanceof Error
                        ? `${error.message}\n${error.stack}`
                        : 'Failed to add brand',
                ],
            },
        }
    }
}

// Edit brand
export async function editBrand(
    prevState: BrandActionState,
    formData: FormData
): Promise<BrandActionState> {
    try {
        await checkAuth()
        const supabase = await createClient()

        // Extract form data
        const id = (formData.get('id') ?? '') as string
        const name = (formData.get('name') ?? '') as string
        const logo_light = (formData.get('logo_light') ?? '') as string
        const logo_dark = (formData.get('logo_dark') ?? '') as string
        const description = (formData.get('description') ?? '') as string
        const delete_light_logo = (formData.get('delete_light_logo') ?? '') as string
        const delete_dark_logo = (formData.get('delete_dark_logo') ?? '') as string

        // Validation
        const errors: BrandActionState['errors'] = {}

        if (!id) {
            errors.general = ['Brand ID is required']
        }

        if (!name || name.trim().length === 0) {
            errors.name = ['Brand name is required']
        } else if (name.length > 255) {
            errors.name = ['Brand name must be less than 255 characters']
        }

        // Make both logos optional - at least one should be provided
        if (!logo_light || logo_light.trim().length === 0) {
            if (!logo_dark || logo_dark.trim().length === 0) {
                errors.logo_light = ['At least one logo (light or dark) is required']
                errors.logo_dark = ['At least one logo (light or dark) is required']
            }
        }

        if (description && description.length > 1000) {
            errors.description = ['Description must be less than 1000 characters']
        }

        if (Object.keys(errors).length > 0) {
            return { errors }
        }

        // Check if brand exists
        const { data: existingBrand } = await supabase
            .from('brands')
            .select('*')
            .eq('id', id)
            .single()

        if (!existingBrand) {
            return {
                errors: {
                    general: ['Brand not found'],
                },
            }
        }

        // Check if name already exists for other brands
        const { data: nameExists } = await supabase
            .from('brands')
            .select('id')
            .eq('name', name.trim())
            .neq('id', id)
            .single()

        if (nameExists) {
            return {
                errors: {
                    name: ['A brand with this name already exists'],
                },
            }
        }

        // Handle logo deletion and upload
        let finalLightLogo = logo_light.trim()
        let finalDarkLogo = logo_dark.trim()

        // If only one logo is provided, use it for both light and dark
        if (logo_light.trim() && !logo_dark.trim()) {
            finalDarkLogo = logo_light.trim()
        } else if (logo_dark.trim() && !logo_light.trim()) {
            finalLightLogo = logo_dark.trim()
        }

        // Check if we need to delete old logos
        const shouldDeleteOldLogos = delete_light_logo === 'true' || delete_dark_logo === 'true'

        if (shouldDeleteOldLogos) {
            try {
                await deleteBrandLogos(existingBrand.name, {
                    light: delete_light_logo === 'true',
                    dark: delete_dark_logo === 'true',
                })
            } catch (error) {
                // Log error but continue with the update
                logWarning('Failed to delete old logos:', error)
            }
        }

        if (logo_light.trim() || logo_dark.trim()) {
            const uploadedLogos = await uploadBrandLogos(
                name.trim(),
                logo_light.trim(),
                logo_dark.trim()
            )

            if (uploadedLogos.lightLogoUrl) {
                finalLightLogo = uploadedLogos.lightLogoUrl
            }
            if (uploadedLogos.darkLogoUrl) {
                finalDarkLogo = uploadedLogos.darkLogoUrl
            }
        }

        // Create logo JSONB object
        const logoObject: { light: string | null; dark: string | null } = {
            light: finalLightLogo || null,
            dark: finalDarkLogo || null,
        }

        // If a logo was deleted and not replaced, set to null
        if (delete_light_logo === 'true' && !logo_light.trim()) logoObject.light = null
        if (delete_dark_logo === 'true' && !logo_dark.trim()) logoObject.dark = null

        // Update brand
        const { error } = await supabase
            .from('brands')
            .update({
                name: name.trim(),
                logo: logoObject,
                description: description?.trim() || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            return {
                errors: {
                    general: [error.message],
                },
            }
        }

        revalidatePath('/')
        revalidateTag('brands') // Invalidate brands cache

        return {
            success: true,
            message: 'Brand updated successfully!',
        }
    } catch (error) {
        return {
            errors: {
                general: [error instanceof Error ? error.message : 'Failed to update brand'],
            },
        }
    }
}

// Delete brand
export async function deleteBrand(
    prevState: BrandActionState,
    formData: FormData
): Promise<BrandActionState> {
    try {
        await checkAuth()
        const supabase = await createClient()

        // Extract brand ID
        const id = formData.get('id') as string

        if (!id) {
            return {
                errors: {
                    general: ['Brand ID is required'],
                },
            }
        }

        const { error } = await supabase.from('brands').delete().eq('id', parseInt(id))

        if (error) {
            return {
                errors: {
                    general: [error.message],
                },
            }
        }

        revalidatePath('/')
        revalidateTag('brands') // Invalidate brands cache

        return {
            success: true,
            message: 'Brand deleted successfully!',
        }
    } catch (error) {
        return {
            errors: {
                general: [error instanceof Error ? error.message : 'Failed to delete brand'],
            },
        }
    }
}

// Get single brand by ID
export async function getBrandById(id: number) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase.from('brands').select('*').eq('id', id).single()

        if (error) {
            throw new Error(error.message)
        }

        return { data, error: null }
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch brand',
        }
    }
}
