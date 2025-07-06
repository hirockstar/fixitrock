import { userProducts } from '®actions/products'

import ProductsTable from './table'
import ProductsCard from './card'

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
        <div className='mt-4 flex w-full flex-col gap-4 p-2 md:px-4 2xl:px-[10%]'>
            {/* <NavBar canManage={canManage} /> */}
            {canManage ? (
                <ProductsTable canManage={canManage} products={products} />
            ) : (
                <ProductsCard products={products} />
            )}
        </div>
    )
}
