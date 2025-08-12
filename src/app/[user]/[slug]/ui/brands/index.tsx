import { getAllBrands } from '@/actions/brands'
import { Brand } from '@/types/brands'

import { BrandCard } from './card'

export async function Brands() {
    const { data: brands } = await getAllBrands()

    return (
        <div className='flex w-full flex-col gap-4 p-2 md:px-4 2xl:px-[10%]'>
            <BrandCard brands={brands as Brand[]} />
        </div>
    )
}
