'use server'

import { revalidatePath } from 'next/cache'

import { logWarning } from '®lib/utils'
import { createClient } from '®supabase/server'
import { Product, ProductsResult } from '®types/products'

import { getCurrentUser } from './supabase'

// Helper function to validate user owns the product
async function validateProductOwnership(productId: number, userId: string) {
    const supabase = await createClient()
    const { data: product, error } = await supabase
        .from('products')
        .select('createdBy, deleted_at')
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

    if (product.createdBy !== userId) {
        throw new Error('Unauthorized: You can only modify your own products')
    }

    return product
}

// Generate slug from name and category
function generateSlug(name: string, category?: string): string {
    const slugify = (str: string) =>
        str
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')

    const nameSlug = slugify(name)
    const categorySlug = category ? slugify(category) : ''

    return categorySlug ? `${nameSlug}-${categorySlug}` : nameSlug
}

// Utility to upload up to 4 images to Supabase Storage and return public URLs
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

        const path = `user/@${username}/products/${productSlug}/${Date.now()}.${ext}`
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
    const supabase = await createClient()
    // List all files in the product's folder
    const folderPath = `user/@${username}/products/${productId}`
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
        const currentUser = await getCurrentUser()
        // Dynamically extract all fields from formData
        const data: Record<string, unknown> = {}

        for (const [key, value] of formData.entries()) {
            // Skip files and images for now, handle below
            if (key === 'img' || key === 'existingImg[]') continue
            data[key] = value
        }
        // Add required fields
        data.createdBy = currentUser.id
        // Generate slug if name and category are present
        if (data.name && data.category) {
            data.slug = generateSlug(data.name as string, data.category as string)
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
            const newUrls = await uploadUserProductImages(
                currentUser.username,
                inserted.slug,
                files
            )

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
        const currentUser = await getCurrentUser()
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
                    // URL format: https://.../storage/v1/object/public/user/@username/products/slug/filename
                    const match = imageUrl.match(
                        /\/storage\/v1\/object\/public\/user\/@([^\/]+)\/products\/([^\/]+)\/([^\/]+)$/
                    )

                    if (match && match[1] && match[2] && match[3]) {
                        const username = match[1]
                        const productSlug = match[2]
                        const filename = match[3]
                        const path = `user/@${username}/products/${productSlug}/${filename}`

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
                    currentUser.username,
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
export async function deleteProduct(
    prevState: { errors: Record<string, string> },
    formData: FormData
): Promise<{ errors: Record<string, string> }> {
    try {
        // Get current authenticated user
        const currentUser = await getCurrentUser()

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
            await validateProductOwnership(id, currentUser.id)
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
        const currentUser = await getCurrentUser()

        // Validate product ownership (including trashed products)
        const supabase = await createClient()
        const { data: product, error } = await supabase
            .from('products')
            .select('createdBy, img')
            .eq('id', productId)
            .single()

        if (error || !product) {
            throw new Error('Product not found')
        }

        if (product.createdBy !== currentUser.id) {
            throw new Error('Unauthorized: You can only delete your own products')
        }

        // Delete all product images from storage
        await deleteAllProductImages(currentUser.username, productId)

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
        const currentUser = await getCurrentUser()

        // Validate product ownership (including trashed products)
        const supabase = await createClient()
        const { data: product, error } = await supabase
            .from('products')
            .select('createdBy')
            .eq('id', productId)
            .single()

        if (error || !product) {
            throw new Error('Product not found')
        }

        if (product.createdBy !== currentUser.id) {
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
    delete: typeof deleteProduct
    restore: (productId: number) => Promise<{ success: boolean; error?: string }>
    get: (targetUsername: string, includeTrashed?: boolean) => Promise<ProductsResult>
    permanentlyDelete: (productId: number) => Promise<{ success: boolean; error?: string }>
}

/**
 * Get products data and actions in a single object
 *
 * Usage Examples:
 *
 * // Method 1: Get products for current user (if authenticated)
 * const { products, canManage, add, edit, delete: remove, restore } = await getProducts()
 *
 * // Method 2: Get products for specific user
 * const { products, canManage, add, edit, delete: remove, restore } = await getProducts(username)
 *
 * // Method 3: Use alternative name
 * const { products, canManage, add, edit, delete: remove, restore } = await userProducts(username)
 *
 * // Usage:
 * // Access data
 * console.log(products) // Array of products
 * console.log(canManage) // Boolean permission
 *
 * // Use actions
 * await add(newProduct)
 * await edit(productId, updatedData)
 * await remove(productId)
 * await restore(productId)
 * const canEdit = await checkCanManage(username)
 */
export async function getProducts(targetUsername?: string): Promise<ProductsWithActions> {
    try {
        const supabase = await createClient()

        // Get current authenticated user (if any)
        let currentUser = null

        try {
            currentUser = await getCurrentUser()
        } catch {
            // User not authenticated - can only view, not manage
        }

        // Determine which user's products to fetch
        let productsUsername = targetUsername

        if (!productsUsername && currentUser) {
            productsUsername = currentUser.username
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
            canManage = currentUser?.username === targetUser.username

            // Build query for products
            const query = supabase
                .from('products')
                .select('*')
                .eq('createdBy', targetUser.id)
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
                    const currentUser = await getCurrentUser()

                    return currentUser.username === targetUsername
                } catch {
                    return false
                }
            },
            delete: deleteProduct,
            restore: restoreProduct,
            get: async (
                targetUsername: string,
                includeTrashed: boolean = false
            ): Promise<ProductsResult> => {
                try {
                    const supabase = await createClient()

                    // Get current authenticated user (if any)
                    let currentUser = null

                    try {
                        currentUser = await getCurrentUser()
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
                    const canManage = currentUser?.username === targetUser.username

                    // Build query for products
                    let query = supabase
                        .from('products')
                        .select('*')
                        .eq('createdBy', targetUser.id)
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
                    const currentUser = await getCurrentUser()

                    return currentUser.username === targetUsername
                } catch {
                    return false
                }
            },
            delete: deleteProduct,
            restore: restoreProduct,
            get: async (
                targetUsername: string,
                includeTrashed: boolean = false
            ): Promise<ProductsResult> => {
                try {
                    const supabase = await createClient()

                    // Get current authenticated user (if any)
                    let currentUser = null

                    try {
                        currentUser = await getCurrentUser()
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
                    const canManage = currentUser?.username === targetUser.username

                    // Build query for products
                    let query = supabase
                        .from('products')
                        .select('*')
                        .eq('createdBy', targetUser.id)
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

/**
 * Alternative name for getProducts - same functionality
 * Usage: const { add, edit, canManage, delete: remove, restore } = userProducts()
 */
export const userProducts = getProducts
