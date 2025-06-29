'use server'

import { cookies } from 'next/headers'

import { adminAuth } from '®firebase/admin'
import { createClient } from '®supabase/server'
import { Product, ProductsResult } from '®types/products'

// Helper function to get current authenticated user
async function getCurrentUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (!token) {
        throw new Error('Not authenticated')
    }

    try {
        const decoded = await adminAuth.verifyIdToken(token)
        const uid = decoded.uid

        const supabase = await createClient()
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', uid)
            .single()

        if (error || !user) {
            throw new Error('User not found')
        }

        return user
    } catch {
        throw new Error('Authentication failed')
    }
}

// Helper function to validate user owns the product
async function validateProductOwnership(productId: number, userId: string) {
    const supabase = await createClient()
    const { data: product, error } = await supabase
        .from('products')
        .select('createdBy')
        .eq('id', productId)
        .eq('deleted_at', null) // Only active products
        .single()

    if (error || !product) {
        throw new Error('Product not found')
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

/**
 * Add a new product (only for authenticated user's own profile)
 * Works with useActionState pattern
 */
export async function addProduct(
    prevState: { errors: Record<string, string> },
    formData: FormData
) {
    try {
        // Get current authenticated user
        const currentUser = await getCurrentUser()

        // Extract and validate form data
        const name = formData.get('name') as string
        const compatible = formData.get('compatible') as string
        const description = formData.get('description') as string
        const purchase = parseFloat(formData.get('purchase') as string)
        const staff_price = parseFloat(formData.get('staff_price') as string) || null
        const price = parseFloat(formData.get('price') as string) || null
        const qty = parseInt(formData.get('qty') as string)
        const category = formData.get('category') as string
        const brand = formData.get('brand') as string

        // Basic validation
        const errors: Record<string, string> = {}

        if (!name || name.trim().length === 0) {
            errors.name = 'Product name is required'
        }

        if (isNaN(purchase) || purchase <= 0) {
            errors.purchase = 'Purchase price must be positive'
        }

        if (isNaN(qty) || qty < 0) {
            errors.qty = 'Quantity must be non-negative'
        }

        if (!category || category.trim().length === 0) {
            errors.category = 'Category is required'
        }

        if (!brand || brand.trim().length === 0) {
            errors.brand = 'Brand is required'
        }

        // If there are validation errors, return them
        if (Object.keys(errors).length > 0) {
            return { errors }
        }

        // Generate slug
        const slug = generateSlug(name, category)

        const supabase = await createClient()

        // Check if product with same slug already exists for this user
        const { data: existingProduct } = await supabase
            .from('products')
            .select('id')
            .eq('createdBy', currentUser.id)
            .eq('slug', slug)
            .eq('deleted_at', null)
            .single()

        if (existingProduct) {
            return {
                errors: {
                    name: 'This product already exists',
                },
            }
        }

        // Insert new product
        const { error } = await supabase.from('products').insert({
            name: name.trim(),
            compatible: compatible.trim() || null,
            description: description.trim() || null,
            purchase,
            staff_price,
            price,
            qty,
            category: category.trim(),
            brand: brand.trim(),
            createdBy: currentUser.id,
            slug,
            img: [],
            other: {},
        })

        if (error) {
            return {
                errors: {
                    general: `Failed to add product: ${error.message}`,
                },
            }
        }

        return { errors: {} }
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
        // Get current authenticated user
        const currentUser = await getCurrentUser()

        // Extract and validate form data
        const id = parseInt(formData.get('id') as string)
        const name = formData.get('name') as string
        const compatible = formData.get('compatible') as string
        const description = formData.get('description') as string
        const purchase = parseFloat(formData.get('purchase') as string)
        const staff_price = parseFloat(formData.get('staff_price') as string) || null
        const price = parseFloat(formData.get('price') as string) || null
        const qty = parseInt(formData.get('qty') as string)
        const category = formData.get('category') as string
        const brand = formData.get('brand') as string

        // Basic validation
        const errors: Record<string, string> = {}

        if (!id || isNaN(id)) {
            errors.id = 'Product ID is required'
        }

        if (!name || name.trim().length === 0) {
            errors.name = 'Product name is required'
        }

        if (isNaN(purchase) || purchase <= 0) {
            errors.purchase = 'Purchase price must be positive'
        }

        if (isNaN(qty) || qty < 0) {
            errors.qty = 'Quantity must be non-negative'
        }

        if (!category || category.trim().length === 0) {
            errors.category = 'Category is required'
        }

        if (!brand || brand.trim().length === 0) {
            errors.brand = 'Brand is required'
        }

        // If there are validation errors, return them
        if (Object.keys(errors).length > 0) {
            return { errors }
        }

        // Validate product ownership
        await validateProductOwnership(id, currentUser.id)

        const supabase = await createClient()

        // If name or category changed, generate new slug
        const updateData: {
            name: string
            compatible: string | null
            description: string | null
            purchase: number
            staff_price: number | null
            price: number | null
            qty: number
            category: string
            brand: string
            slug?: string
        } = {
            name: name.trim(),
            compatible: compatible.trim() || null,
            description: description.trim() || null,
            purchase,
            staff_price,
            price,
            qty,
            category: category.trim(),
            brand: brand.trim(),
        }

        if (name || category) {
            const { data: existingProduct } = await supabase
                .from('products')
                .select('name, category')
                .eq('id', id)
                .single()

            const newName = name || existingProduct?.name || ''
            const newCategory = category || existingProduct?.category || ''
            const newSlug = generateSlug(newName, newCategory)

            // Check if new slug conflicts with existing product
            const { data: slugConflict } = await supabase
                .from('products')
                .select('id')
                .eq('createdBy', currentUser.id)
                .eq('slug', newSlug)
                .neq('id', id)
                .eq('deleted_at', null)
                .single()

            if (slugConflict) {
                return {
                    errors: {
                        name: 'A product with this name and category already exists',
                    },
                }
            }

            updateData.slug = newSlug
        }

        // Update product
        const { error } = await supabase.from('products').update(updateData).eq('id', id)

        if (error) {
            return {
                errors: {
                    general: `Failed to update product: ${error.message}`,
                },
            }
        }

        return { errors: {} }
    } catch (error) {
        return {
            errors: {
                general: error instanceof Error ? error.message : 'Unknown error occurred',
            },
        }
    }
}

/**
 * Soft delete a product (move to trash)
 */
export async function deleteProduct(productId: number) {
    try {
        // Get current authenticated user
        const currentUser = await getCurrentUser()

        // Validate product ownership
        await validateProductOwnership(productId, currentUser.id)

        const supabase = await createClient()

        // Soft delete (move to trash)
        const { error } = await supabase
            .from('products')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', productId)

        if (error) {
            throw new Error(`Failed to delete product: ${error.message}`)
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
            .select('createdBy')
            .eq('id', productId)
            .single()

        if (error || !product) {
            throw new Error('Product not found')
        }

        if (product.createdBy !== currentUser.id) {
            throw new Error('Unauthorized: You can only delete your own products')
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
    delete: (productId: number) => Promise<{ success: boolean; error?: string }>
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
