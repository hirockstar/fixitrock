import { NextRequest } from 'next/server'

import { getUser } from '@/actions/user'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params
        const user = await getUser(username)

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Only generate manifest for shopkeepers and admins (role 2 & 3)
        if (user.role !== 2 && user.role !== 3) {
            return new Response(JSON.stringify({ error: 'Not a shopkeeper' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const manifest = {
            name: `${user.name} - Fix iT Rock`,
            short_name: user.name,
            description: `Shop with ${user.name} on Fix iT Rock - Mobile Solutions & E-commerce`,
            start_url: `/@${user.username}`,
            scope: `/@${user.username}`,
            display: 'standalone',
            orientation: 'portrait',
            theme_color: '#000000',
            background_color: '#ffffff',
            icons: [
                {
                    src: user.avatar || '/fallback/boy.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
                {
                    src: user.avatar || '/fallback/boy.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
            ],
            categories: ['business', 'shopping', 'utilities'],
            lang: 'en',
            dir: 'ltr',
        }

        return new Response(JSON.stringify(manifest), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
        })
    } catch {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
