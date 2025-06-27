import { redirect } from 'next/navigation'

import { getUser } from '®actions/auth'
import { getSlug } from '®actions/supabase/getSlug'

import Products from './ui/products'
const components: Record<
    string,
    React.ComponentType<{ params: { user: string; slug: string } }>
> = {
    Products: Products,
}

type Props = {
    params: Promise<{ user: string; slug: string }>
}

export default async function SlugPage({ params }: Props) {
    const { user, slug } = await params
    const cleanUsername = decodeURIComponent(user).replace(/^@/, '')
    const userObj = await getUser(cleanUsername)

    if (!userObj) return redirect('/login')

    const allowedSlugs = await getSlug(userObj.role || 0)
    const slugConfig = allowedSlugs.find((s) => s && s.slug === slug)

    if (!slugConfig) return redirect(`/@${cleanUsername}`)

    const SectionComponent =
        components[slugConfig.component] || (() => <div>Component not found</div>)

    return (
        <>
            <SectionComponent params={{ user: cleanUsername, slug }} />
        </>
    )
}
