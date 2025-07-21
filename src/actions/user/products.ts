'use server'

import type { Product, Products } from '®types/products'

import { revalidatePath } from 'next/cache'

import { createClient } from '®supabase/server'
import { slugify } from '®lib/utils'

// Input type for creating a product (all fields except those auto-generated or managed by backend)
export type ProductInsert = Omit<
    Product,
    'id' | 'user_id' | 'deleted_at' | 'created_at' | 'updated_at'
>
async function getUsername(userId: string): Promise<string> {
    const supabase = await createClient()
    const { data: userRow } = await supabase
        .from('users')
        .select('username')
        .eq('id', userId)
        .single()

    return userRow?.username || userId
}
// Upload up to 4 images for a product, return public URLs
async function uploadProductImages(
    username: string,
    slug: string,
    files: File[]
): Promise<string[]> {
    const supabase = await createClient()
    const urls: string[] = []

    for (let i = 0; i < files.length && i < 4; i++) {
        const file = files[i]
        let ext = 'jpg'

        if (file.name && file.name.includes('.')) {
            const parts = file.name.split('.')

            if (parts.length > 1) ext = parts[parts.length - 1].toLowerCase()
        }
        if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) ext = 'jpg'
        const path = `@${username}/products/${slug}/${Date.now()}.${ext}`
        const arrayBuffer = await file.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        const { error } = await supabase.storage.from('user').upload(path, bytes, {
            cacheControl: '3600',
            upsert: false,
        })

        if (error) throw error
        const { data } = supabase.storage.from('user').getPublicUrl(path)

        urls.push(data.publicUrl)
    }

    return urls
}

// Delete all images for a product
async function removeProductImages(username: string, slug: string) {
    const supabase = await createClient()
    const folderPath = `user/@${username}/products/${slug}`
    const { data, error } = await supabase.storage.from('user').list(folderPath, { limit: 100 })

    if (error) return
    if (data && data.length > 0) {
        const paths = data.map((file) => `${folderPath}/${file.name}`)

        await supabase.storage.from('user').remove(paths)
    }
}

// --- Product Actions ---

export async function addProduct(form: ProductInsert, images: File[] = []): Promise<void> {
    const supabase = await createClient()
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) throw new Error('Unauthorized')
    const slug = slugify(form.name + '-' + (form.category || ''))
    let img: string[] = []
    const username = await getUsername(user.id)

    if (images.length > 0) {
        img = await uploadProductImages(username, slug, images)
    }
    const { error } = await supabase.from('products').insert({
        ...form,
        user_id: user.id,
        slug,
        img,
    })

    if (error) throw new Error(error.message)
    revalidatePath('/[user]/[slug]', 'page')
    revalidatePath('/[user]', 'page')
}

export async function editProduct(
    id: number,
    values: Partial<ProductInsert>,
    images: File[] = [],
    keepImages: string[] = []
): Promise<void> {
    const supabase = await createClient()
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) throw new Error('Unauthorized')
    const username = await getUsername(user.id)
    // Get current product for slug and images
    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('slug,img')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !product) throw new Error('Product not found')
    // Remove images not in keepImages
    const removed = (product.img || []).filter((url: string) => !keepImages.includes(url))

    if (removed.length > 0) {
        for (const imageUrl of removed) {
            const match = imageUrl.match(
                /\/storage\/v1\/object\/public\/user\/@([^\/]+)\/products\/([^\/]+)\/(.+)$/
            )

            if (match && match[1] && match[2] && match[3]) {
                const path = `@${match[1]}/products/${match[2]}/${match[3]}`

                await supabase.storage.from('user').remove([path])
            }
        }
    }
    // Upload new images
    let imgUrls = [...keepImages]

    if (images.length > 0) {
        const newUrls = await uploadProductImages(username, product.slug, images)

        imgUrls = [...imgUrls, ...newUrls]
    }
    const { error } = await supabase
        .from('products')
        .update({ ...values, img: imgUrls, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)
    revalidatePath('/[user]/[slug]', 'page')
    revalidatePath('/[user]', 'page')
}

export async function softDeleteProduct(
    state: { errors: Record<string, string> },
    formData: FormData
): Promise<{ errors: Record<string, string> }> {
    const id = Number(formData.get('id'))

    if (!id) return { errors: { general: 'Invalid product id' } }
    const supabase = await createClient()
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) return { errors: { general: 'Unauthorized' } }
    const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { errors: { general: error.message } }
    revalidatePath('/[user]/[slug]', 'page')
    revalidatePath('/[user]', 'page')

    return { errors: {} }
}

export async function restoreProduct(id: number): Promise<void> {
    const supabase = await createClient()
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) throw new Error('Unauthorized')
    const { error } = await supabase
        .from('products')
        .update({ deleted_at: null })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)
    revalidatePath('/[user]/[slug]', 'page')
    revalidatePath('/[user]', 'page')
}

export async function deleteProductPermanently(id: number): Promise<void> {
    const supabase = await createClient()
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) throw new Error('Unauthorized')
    const username = await getUsername(user.id)
    // Get product for slug
    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('slug')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !product) throw new Error('Product not found')
    // Remove all images
    await removeProductImages(username, product.slug)
    // Delete product
    const { error } = await supabase.from('products').delete().eq('id', id).eq('user_id', user.id)

    if (error) throw new Error(error.message)
    revalidatePath('/[user]/[slug]', 'page')
    revalidatePath('/[user]', 'page')
}

export async function setProductQty(id: number, qty: number): Promise<void> {
    const supabase = await createClient()
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) throw new Error('Unauthorized')
    const { error } = await supabase
        .from('products')
        .update({ qty, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)
    revalidatePath('/[user]/[slug]', 'page')
    revalidatePath('/[user]', 'page')
}

export async function getProducts(
    username: string
): Promise<{ products: Products; canManage: boolean }> {
    const supabase = await createClient()
    const { data: sessionUser } = await supabase.auth.getUser()
    const { data: targetUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single()

    if (!targetUser) throw new Error('User not found')

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', targetUser.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    const canManage = sessionUser?.user?.id === targetUser.id

    return {
        products: (products ?? []) as Products,
        canManage,
    }
}
