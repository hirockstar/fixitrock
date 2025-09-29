import { getAllBrands } from '@/actions/brands'
import { Brand } from '@/types/brands'
import { getProducts } from '@/actions/user/products'

import ProductsTable from './table'
import ProductsCard from './card'

interface ProductsProps {
    params: {
        user: string
    }
}

export default async function Products({ params }: ProductsProps) {
    const { products, canManage } = await getProducts(params.user)
    const { data: brands = [] } = await getAllBrands()

    return (
        <div className='mb-4 flex h-full w-full flex-col gap-4 px-2 md:px-4 2xl:px-[10%]'>
            {canManage ? (
                <ProductsTable
                    brand={brands as Brand[]}
                    canManage={canManage}
                    products={products}
                />
            ) : (
                <ProductsCard products={products} />
            )}
        </div>
    )
}
