import { userProducts } from '®actions/products'

import NavBar from './navbar'
import ProductsList from './list'

interface ProductsProps {
    params: {
        user: string
        slug: string
    }
}

export default async function Products({ params }: ProductsProps) {
    // Get products data and actions in one call
    const { products, canManage } = await userProducts(params.user)

    return (
        <div className='flex w-full flex-col gap-4 p-2 md:mt-2 md:px-[5%] 2xl:px-[10%]'>
            <NavBar canManage={canManage} />
            <ProductsList canManage={canManage} products={products} />
        </div>
    )
}
