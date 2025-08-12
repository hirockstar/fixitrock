'use server'

import { revalidatePath } from 'next/cache'

import { logWarning, slugify } from '@/lib/utils'
import { createClient } from '@/supabase/server'
import { Product, ProductsResult } from '@/types/products'

async function userSession() {
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
}

async function validateProductOwnership(productId: number, userId: string) {
    const supabase = await createClient()
    const { data: product, error } = await supabase
        .from('products')
        .select('user_id, deleted_at')
        .eq('id', productId)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            throw new Error('Product not found')
        }
        throw new Error(`Database error: ${error.message}`)
    }

    if (!product) {
        throw new Error('Product not found')
    }

    if (product.deleted_at) {
        throw new Error('Product has been deleted')
    }

    if (product.user_id !== userId) {
        throw new Error('Unauthorized: You can only modify your own products')
    }

    return product
}

async function uploadUserProductImages(
    username: string,
    productSlug: string,
    files: File[]
): Promise<string[]> {
    const supabase = await createClient()
    const urls: string[] = []

    for (let i = 0; i < files.length && i < 4; i++) {
        const file = files[i]
        // Fix file extension extraction
        let ext = 'jpg' // default fallback

        if (file.name && file.name.includes('.')) {
            const parts = file.name.split('.')

            if (parts.length > 1) {
                ext = parts[parts.length - 1].toLowerCase()
            }
        }
        // Validate extension
        if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            ext = 'jpg' // fallback to jpg if invalid extension
        }

        const path = `@${username}/products/${productSlug}/${Date.now()}.${ext}`
        const { error } = await supabase.storage.from('user').upload(path, file, {
            cacheControl: '3600',
            upsert: false,
        })

        if (error) throw error
        const publicUrlData = supabase.storage.from('user').getPublicUrl(path)

        urls.push(publicUrlData.data.publicUrl)
    }

    return urls
}

// Helper to delete all images in a product's storage folder
async function deleteAllProductImages(username: string, productId: number) {
    if (!username) return // Guard: do nothing if username is empty or undefined
    const supabase = await createClient()
    // List all files in the product's folder
    const folderPath = `@${username}/products/${productId}`
    const { data, error } = await supabase.storage.from('user').list(folderPath, { limit: 100 })

    if (error) return // Ignore errors for now
    if (data && data.length > 0) {
        // Delete all files in the folder
        const paths = data.map((file) => `${folderPath}/${file.name}`)

        await supabase.storage.from('user').remove(paths)
    }
}

/**
 * Add a new product (only for authenticated user's own profile)
 * Works with useActionState pattern
 */
export async function addProduct(
    prevState: { errors: Record<string, string> },
    formData: FormData
) {
    try {
        const user = await userSession()
        const data: Record<string, unknown> = {}

        for (const [key, value] of formData.entries()) {
            if (key === 'img' || key === 'existingImg[]') continue
            data[key] = value
        }

        data.user_id = user.id

        if (data.name && data.category) {
            data.slug = slugify(data.name + '-' + (data.category || ''))
        }
        // Insert new product (without images)
        const supabase = await createClient()
        const { data: inserted, error: insertError } = await supabase
            .from('products')
            .insert({
                ...data,
                img: [],
                other: {},
            })
            .select()
            .single()

        if (insertError) {
            return {
                errors: {
                    general: `Failed to add product: ${insertError.message}`,
                },
            }
        }
        const productId = inserted.id
        // Handle images
        const existingImg = formData.getAll('existingImg[]').filter(Boolean) as string[]
        const files = formData
            .getAll('img')
            .filter((f) => typeof File !== 'undefined' && f instanceof File) as File[]
        let imgUrls: string[] = existingImg

        if (files.length > 0) {
            const newUrls = await uploadUserProductImages(user.username, inserted.slug, files)

            imgUrls = [...existingImg, ...newUrls]
            await supabase.from('products').update({ img: imgUrls }).eq('id', productId)
        } else if (existingImg.length > 0) {
            await supabase.from('products').update({ img: imgUrls }).eq('id', productId)
        }

        // Revalidate the page to refresh data
        revalidatePath('/[user]/[slug]', 'page')

        return { errors: {} as Record<string, string> }
    } catch (error) {
        return {
            errors: {
                general: error instanceof Error ? error.message : 'Unknown error occurred',
            },
        }
    }
}

/**
 * Update an existing product (only if user owns it)
 * Works with useActionState pattern
 */
export async function updateProduct(
    prevState: { errors: Record<string, string> },
    formData: FormData
) {
    try {
        const user = await userSession()
        const id = parseInt(formData.get('id') as string)
        // Dynamically extract all fields from formData
        const data: Record<string, unknown> = {}

        for (const [key, value] of formData.entries()) {
            // Skip files and images for now, handle below
            if (key === 'img' || key === 'existingImg[]' || key === 'id') continue
            data[key] = value
        }
        // Get existing product with current images
        const supabase = await createClient()
        const { data: currentProduct, error: fetchError } = await supabase
            .from('products')
            .select('img, slug')
            .eq('id', id)
            .single()

        if (fetchError) {
            return { errors: { general: fetchError.message || 'Fetch error' } }
        }

        // Handle images
        const existingImg = formData.getAll('existingImg[]') as string[]
        const newImages = formData.getAll('img') as File[]
        let imgUrls: string[] = existingImg

        // Get current images from database
        const currentImages = currentProduct.img || []

        // Find images that were removed (in currentImages but not in existingImg)
        const removedImages = currentImages.filter((url: string) => !existingImg.includes(url))

        // Delete removed images from storage
        if (removedImages.length > 0 && currentProduct.slug) {
            try {
                for (const imageUrl of removedImages) {
                    // Extract path from URL - fix the regex to get correct path
                    // URL format: https://.../storage/v1/object/public/@username/products/slug/filename
                    const match = imageUrl.match(
                        /\/storage\/v1\/object\/public\/user\/@([^\/]+)\/products\/([^\/]+)\/([^\/]+)$/
                    )

                    if (match && match[1] && match[2] && match[3]) {
                        const username = match[1]
                        const productSlug = match[2]
                        const filename = match[3]
                        const path = `@${username}/products/${productSlug}/${filename}`

                        const { error: deleteError } = await supabase.storage
                            .from('user')
                            .remove([path])

                        if (deleteError) {
                            logWarning('updateProduct: failed to delete from storage:', deleteError)
                        }
                    }
                }
            } catch (e) {
                logWarning('Failed to delete some images from storage:', e)
            }
        }

        // Upload new images
        if (newImages.length > 0 && currentProduct.slug) {
            try {
                const newUrls = await uploadUserProductImages(
                    user.username,
                    currentProduct.slug,
                    newImages
                )

                imgUrls = [...existingImg, ...newUrls]
            } catch (e) {
                return {
                    errors: {
                        general:
                            'Image upload failed: ' + (e instanceof Error ? e.message : String(e)),
                    },
                }
            }
        }

        // Update product
        const { error } = await supabase
            .from('products')
            .update({
                ...data,
                img: imgUrls,
            })
            .eq('id', id)

        if (error) {
            return { errors: { general: error.message || 'Update error' } }
        }

        // Revalidate the page to refresh data
        revalidatePath('/[user]/[slug]', 'page')

        return { errors: {} as Record<string, string> }
    } catch (error) {
        return {
            errors: { general: error instanceof Error ? error.message : 'Unknown error occurred' },
        }
    }
}

/**
 * Soft delete a product (move to trash)
 * Works with useActionState pattern
 */
export async function softDeleteProduct(
    prevState: { errors: Record<string, string> },
    formData: FormData
): Promise<{ errors: Record<string, string> }> {
    try {
        // Get current authenticated user
        const user = await userSession()

        // Extract product ID from form data
        const id = parseInt(formData.get('id') as string)

        // Basic validation
        if (!id || isNaN(id)) {
            return {
                errors: {
                    general: 'Product ID is required',
                },
            }
        }

        try {
            // Validate product ownership
            await validateProductOwnership(id, user.id)
        } catch (error) {
            return {
                errors: {
                    general: error instanceof Error ? error.message : 'Product validation failed',
                },
            }
        }

        const supabase = await createClient()

        // Soft delete (move to trash)
        const { error } = await supabase
            .from('products')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id)

        if (error) {
            return {
                errors: {
                    general: `Failed to delete product: ${error.message}`,
                },
            }
        }

        // Revalidate the page to refresh data
        revalidatePath('/[user]/[slug]', 'page')

        if (user.username) {
            await deleteAllProductImages(user.username, id)
        }

        return { errors: {} as Record<string, string> }
    } catch (error) {
        return {
            errors: {
                general: error instanceof Error ? error.message : 'Unknown error occurred',
            },
        }
    }
}

/**
 * Permanently delete a product from trash
 */
export async function permanentlyDeleteProduct(productId: number) {
    try {
        // Get current authenticated user
        const user = await userSession()

        // Validate product ownership (including trashed products)
        const supabase = await createClient()
        const { data: product, error } = await supabase
            .from('products')
            .select('user_id, img')
            .eq('id', productId)
            .single()

        if (error || !product) {
            throw new Error('Product not found')
        }

        if (product.user_id !== user.id) {
            throw new Error('Unauthorized: You can only delete your own products')
        }

        // Delete all product images from storage
        if (user.username) {
            await deleteAllProductImages(user.username, productId)
        }

        // Permanently delete
        const { error: deleteError } = await supabase.from('products').delete().eq('id', productId)

        if (deleteError) {
            throw new Error(`Failed to permanently delete product: ${deleteError.message}`)
        }

        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }
    }
}

/**
 * Restore a product from trash
 */
export async function restoreProduct(productId: number) {
    try {
        // Get current authenticated user
        const user = await userSession()

        // Validate product ownership (including trashed products)
        const supabase = await createClient()
        const { data: product, error } = await supabase
            .from('products')
            .select('user_id')
            .eq('id', productId)
            .single()

        if (error || !product) {
            throw new Error('Product not found')
        }

        if (product.user_id !== user.id) {
            throw new Error('Unauthorized: You can only restore your own products')
        }

        // Restore product
        const { error: restoreError } = await supabase
            .from('products')
            .update({ deleted_at: null })
            .eq('id', productId)

        if (restoreError) {
            throw new Error(`Failed to restore product: ${restoreError.message}`)
        }

        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }
    }
}

// Type for the complete products object with data and actions
type ProductsWithActions = {
    products: Product[]
    canManage: boolean
    success: boolean
    error?: string
    // Actions
    add: typeof addProduct
    edit: typeof updateProduct
    checkCanManage: (targetUsername: string) => Promise<boolean>
    delete: typeof softDeleteProduct
    restore: (productId: number) => Promise<{ success: boolean; error?: string }>
    get: (targetUsername: string, includeTrashed?: boolean) => Promise<ProductsResult>
    permanentlyDelete: (productId: number) => Promise<{ success: boolean; error?: string }>
}

export async function getProducts(targetUsername?: string): Promise<ProductsWithActions> {
    try {
        const supabase = await createClient()

        // Get current authenticated user (if any)
        let user = null

        try {
            user = await userSession()
        } catch {
            // User not authenticated - can only view, not manage
        }

        // Determine which user's products to fetch
        let productsUsername = targetUsername

        if (!productsUsername && user) {
            productsUsername = user?.username
        }

        let products: Product[] = []
        let canManage = false

        if (productsUsername) {
            // Get target user by username
            const { data: targetUser, error: userError } = await supabase
                .from('users')
                .select('id, username')
                .eq('username', productsUsername)
                .single()

            if (userError || !targetUser) {
                throw new Error('User not found')
            }

            // Check if current user can manage this profile
            canManage = user?.username === targetUser.username

            // Build query for products
            const query = supabase
                .from('products')
                .select('*')
                .eq('user_id', targetUser.id)
                .order('created_at', { ascending: false })
                .is('deleted_at', null) // Only active products

            const { data: productsData, error } = await query

            if (error) {
                throw new Error(`Failed to fetch products: ${error.message}`)
            }

            products = productsData as Product[]
        }

        return {
            success: true,
            products,
            canManage,
            // Actions
            add: addProduct,
            edit: updateProduct,
            checkCanManage: async (targetUsername: string) => {
                try {
                    const currentUser = await userSession()

                    return currentUser.username === targetUsername
                } catch {
                    return false
                }
            },
            delete: softDeleteProduct,
            restore: restoreProduct,
            get: async (
                targetUsername: string,
                includeTrashed: boolean = false
            ): Promise<ProductsResult> => {
                try {
                    const supabase = await createClient()

                    // Get current authenticated user (if any)
                    let user = null

                    try {
                        user = await userSession()
                    } catch {
                        // User not authenticated - can only view, not manage
                    }

                    // Get target user by username
                    const { data: targetUser, error: userError } = await supabase
                        .from('users')
                        .select('id, username')
                        .eq('username', targetUsername)
                        .single()

                    if (userError || !targetUser) {
                        throw new Error('User not found')
                    }

                    // Check if current user can manage this profile
                    const canManage = user?.username === targetUser.username

                    // Build query for products
                    let query = supabase
                        .from('products')
                        .select('*')
                        .eq('user_id', targetUser.id)
                        .order('created_at', { ascending: false })

                    // Filter by deleted status
                    if (!includeTrashed) {
                        query = query.is('deleted_at', null)
                    }

                    const { data: products, error } = await query

                    if (error) {
                        throw new Error(`Failed to fetch products: ${error.message}`)
                    }

                    return {
                        success: true,
                        products: products as Product[],
                        canManage,
                    }
                } catch (error) {
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error occurred',
                        products: [],
                        canManage: false,
                    }
                }
            },
            permanentlyDelete: permanentlyDeleteProduct,
        }
    } catch (error) {
        return {
            success: false,
            products: [],
            canManage: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            // Actions (still available even if data fetch failed)
            add: addProduct,
            edit: updateProduct,
            checkCanManage: async (targetUsername: string) => {
                try {
                    const currentUser = await userSession()

                    return currentUser.username === targetUsername
                } catch {
                    return false
                }
            },
            delete: softDeleteProduct,
            restore: restoreProduct,
            get: async (
                targetUsername: string,
                includeTrashed: boolean = false
            ): Promise<ProductsResult> => {
                try {
                    const supabase = await createClient()

                    // Get current authenticated user (if any)
                    let user = null

                    try {
                        user = await userSession()
                    } catch {
                        // User not authenticated - can only view, not manage
                    }

                    // Get target user by username
                    const { data: targetUser, error: userError } = await supabase
                        .from('users')
                        .select('id, username')
                        .eq('username', targetUsername)
                        .single()

                    if (userError || !targetUser) {
                        throw new Error('User not found')
                    }

                    // Check if current user can manage this profile
                    const canManage = user?.username === targetUser.username

                    // Build query for products
                    let query = supabase
                        .from('products')
                        .select('*')
                        .eq('user_id', targetUser.id)
                        .order('created_at', { ascending: false })

                    // Filter by deleted status
                    if (!includeTrashed) {
                        query = query.is('deleted_at', null)
                    }

                    const { data: products, error } = await query

                    if (error) {
                        throw new Error(`Failed to fetch products: ${error.message}`)
                    }

                    return {
                        success: true,
                        products: products as Product[],
                        canManage,
                    }
                } catch (error) {
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error occurred',
                        products: [],
                        canManage: false,
                    }
                }
            },
            permanentlyDelete: permanentlyDeleteProduct,
        }
    }
}

export async function setProductQty(id: number, newQty: number) {
    try {
        const user = await userSession()

        await validateProductOwnership(id, user.id)

        const supabase = await createClient()
        const { data, error } = await supabase
            .from('products')
            .update({ qty: newQty })
            .eq('id', id)
            .select('*')
            .single()

        if (error) {
            throw new Error(`Failed to update quantity: ${error.message}`)
        }

        revalidatePath('/[user]/[slug]', 'page')
        revalidatePath('/[user]', 'page')

        return { success: true, qty: data.qty, product: data }
    } catch (error) {
        logWarning('Error updating product quantity:', error)
        throw new Error(
            error instanceof Error ? error.message : 'Failed to update product quantity'
        )
    }
}
