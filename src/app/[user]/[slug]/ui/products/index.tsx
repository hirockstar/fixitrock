import { canManageProducts, getUserProducts } from '®actions/products'
import { Product } from '®types/products'

import NavBar from './navbar'
import ProductsList from './list'

interface ProductsProps {
    params: {
        user: string
        slug: string
    }
}

export default async function Products({ params }: ProductsProps) {
    // Call server actions directly in server component with error handling
    let canManage = false
    let products: Product[] = []

    try {
        canManage = await canManageProducts(params.user)
    } catch {
        // If there's an error, default to false (no permissions)
        canManage = false
    }

    try {
        const result = await getUserProducts(params.user)

        if (result.success) {
            products = result.products
        }
    } catch {
        // If there's an error, products will remain empty array
        products = []
    }

    return (
        <div className='flex w-full flex-col gap-4 p-2 md:mt-2 md:px-[5%] 2xl:px-[10%]'>
            <NavBar canManage={canManage} />
            <ProductsList canManage={canManage} products={products} />
        </div>
    )
}
