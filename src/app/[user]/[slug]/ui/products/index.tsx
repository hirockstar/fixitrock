import { canManageProducts } from '®actions/products'

import NavBar from './navbar'

interface ProductsProps {
    params: {
        user: string
        slug: string
    }
}

export default async function Products({ params }: ProductsProps) {
    // Call server action directly in server component with error handling
    let canManage = false

    try {
        canManage = await canManageProducts(params.user)
    } catch {
        // If there's an error, default to false (no permissions)
        canManage = false
    }

    return (
        <div className='flex w-full flex-col gap-4 p-2 md:mt-2 md:px-[5%] 2xl:px-[10%]'>
            <NavBar canManage={canManage} />
        </div>
    )
}
