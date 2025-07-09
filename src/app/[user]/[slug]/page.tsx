import { redirect } from 'next/navigation'

import { getUser, userSession } from '®actions/auth'
import { getSlug } from '®actions/supabase/getSlug'

import Products from './ui/products'
import { Brands } from './ui/brands'
const components: Record<
    string,
    React.ComponentType<{ params: { user: string; slug: string } }>
> = {
    Products: Products,
    Brands: Brands,
}

type Props = {
    params: Promise<{ user: string; slug: string }>
}

export default async function SlugPage({ params }: Props) {
    const { user, slug } = await params
    const cleanUsername = decodeURIComponent(user).replace(/^@/, '')
    const userObj = await getUser(cleanUsername)

    if (!userObj) return redirect('/login')

    const currentUser = await userSession()

    const allowedSlugs = await getSlug(userObj.role || 0)
    const slugConfig = allowedSlugs.find((s) => s && s.slug === slug)

    if (!slugConfig) return redirect(`/@${cleanUsername}`)

    if (
        slugConfig.private &&
        (!currentUser?.user ||
            currentUser.user.username !== cleanUsername ||
            currentUser.user.role !== userObj.role)
    ) {
        return redirect(`/@${cleanUsername}`)
    }

    const SectionComponent = components[slugConfig.component] || (() => <div>Page not found</div>)

    return (
        <>
            <SectionComponent params={{ user: cleanUsername, slug }} />
        </>
    )
}
