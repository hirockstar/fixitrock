import { redirect } from 'next/navigation'

import { getSlug } from '®actions/supabase/getSlug'
import { getUser, userSession } from '®actions/user'

import Products from './ui/products'
import { Brands } from './ui/brands'
import { Settings } from './ui/settings'
import { Teams } from './ui/teams'

const components: Record<string, React.ComponentType<{ params: { user: string } }>> = {
    Products: Products,
    Brands: Brands,
    Settings: Settings,
    Teams: Teams,
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
            <SectionComponent params={{ user: cleanUsername }} />
        </>
    )
}
