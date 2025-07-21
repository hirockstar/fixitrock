'use client'
import { Card, CardBody, CardFooter, Chip, Image, Tooltip } from '@heroui/react'
import { MdProductionQuantityLimits } from 'react-icons/md'

import { formatPrice, getProductImage, getStockStatus } from '®lib/utils'
import { Product, Products } from '®types/products'

export type ProductsListProps = {
    products: Products
}

function ProductImage(product: Product) {
    const src = getProductImage(product)

    if (src) {
        return (
            <Image
                isBlurred
                alt={product.name}
                className='h-[180px] w-full object-cover md:h-56'
                src={src}
                width='100%'
            />
        )
    }

    return (
        <div className='flex h-[180px] w-full items-center justify-center rounded-lg bg-gradient-to-br from-gray-50 to-gray-200 text-5xl shadow-inner md:h-56 dark:from-neutral-900 dark:to-neutral-800'>
            <MdProductionQuantityLimits />
        </div>
    )
}

export default function ProductsCard({ products }: ProductsListProps) {
    return (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]'>
            {products.map((product) => (
                <Card key={product.id} className='border bg-transparent' shadow='none'>
                    <CardBody className='overflow-visible p-1'>
                        <ProductImage {...product} />
                    </CardBody>
                    <CardFooter className='items-center justify-between gap-1'>
                        <h1 className='line-clamp-1 flex-1'>{product.name}</h1>

                        <p className='text-muted-foreground text-xs'>
                            {formatPrice(product.price ?? 0)}
                        </p>
                    </CardFooter>
                    <Tooltip content={getStockStatus(product.qty).text}>
                        <Chip
                            className='absolute top-3 right-3 z-10 size-3 min-w-0'
                            color={getStockStatus(product.qty).color}
                        />
                    </Tooltip>
                </Card>
            ))}
        </div>
    )
}
