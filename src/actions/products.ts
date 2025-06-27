'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'

import { adminAuth } from '®firebase/admin'
import { createClient } from '®supabase/server'
import { Product } from '®types/products'

// Validation schemas
const ProductSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    purchase: z.number().positive('Purchase price must be positive'),
    staff_price: z.number().positive().optional(),
    price: z.number().positive().optional(),
    qty: z.number().int().min(0, 'Quantity must be non-negative'),
    category: z.string().optional(),
    brand: z.string().optional(),
    img: z
        .array(z.union([z.string(), z.object({ url: z.string(), alt: z.string().optional() })]))
        .optional(),
    other: z.record(z.unknown()).optional(),
})

const UpdateProductSchema = ProductSchema.partial().extend({
    id: z.number().positive('Product ID is required'),
})

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
 */
export async function addProduct(productData: z.infer<typeof ProductSchema>) {
    try {
        // Validate input
        const validatedData = ProductSchema.parse(productData)

        // Get current authenticated user
        const currentUser = await getCurrentUser()

        // Generate slug
        const slug = generateSlug(validatedData.name, validatedData.category)

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
            throw new Error('A product with this name and category already exists')
        }

        // Insert new product
        const { data: newProduct, error } = await supabase
            .from('products')
            .insert({
                ...validatedData,
                createdBy: currentUser.id,
                slug,
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to add product: ${error.message}`)
        }

        return { success: true, product: newProduct }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        }
    }
}

/**
 * Update an existing product (only if user owns it)
 */
export async function updateProduct(productData: z.infer<typeof UpdateProductSchema>) {
    try {
        // Validate input
        const validatedData = UpdateProductSchema.parse(productData)

        // Get current authenticated user
        const currentUser = await getCurrentUser()

        // Validate product ownership
        await validateProductOwnership(validatedData.id, currentUser.id)

        const supabase = await createClient()

        // If name or category changed, generate new slug
        const updateData: z.infer<typeof UpdateProductSchema> & { slug?: string } = {
            ...validatedData,
        }

        if (validatedData.name || validatedData.category) {
            const { data: existingProduct } = await supabase
                .from('products')
                .select('name, category')
                .eq('id', validatedData.id)
                .single()

            const newName = validatedData.name || existingProduct?.name || ''
            const newCategory = validatedData.category || existingProduct?.category || ''
            const newSlug = generateSlug(newName, newCategory)

            // Check if new slug conflicts with existing product
            const { data: slugConflict } = await supabase
                .from('products')
                .select('id')
                .eq('createdBy', currentUser.id)
                .eq('slug', newSlug)
                .neq('id', validatedData.id)
                .eq('deleted_at', null)
                .single()

            if (slugConflict) {
                throw new Error('A product with this name and category already exists')
            }

            updateData.slug = newSlug
        }

        // Update product
        const { data: updatedProduct, error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', validatedData.id)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to update product: ${error.message}`)
        }

        return { success: true, product: updatedProduct }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
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

/**
 * Get user's products (active only)
 */
export async function getUserProducts(username: string, includeTrashed: boolean = false) {
    try {
        const supabase = await createClient()

        // Get user by username
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('username', username)
            .single()

        if (userError || !user) {
            throw new Error('User not found')
        }

        // Build query
        let query = supabase
            .from('products')
            .select('*')
            .eq('createdBy', user.id)
            .order('created_at', { ascending: false })

        // Filter by deleted status
        if (!includeTrashed) {
            query = query.is('deleted_at', null)
        }

        const { data: products, error } = await query

        if (error) {
            throw new Error(`Failed to fetch products: ${error.message}`)
        }

        return { success: true, products: products as Product[] }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            products: [],
        }
    }
}

/**
 * Check if current user can manage products on a specific profile
 */
export async function canManageProducts(targetUsername: string) {
    try {
        const currentUser = await getCurrentUser()

        return currentUser.username === targetUsername
    } catch {
        return false
    }
}
