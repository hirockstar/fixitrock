import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    transpilePackages: ['next-mdx-remote'],
    experimental: {
        serverActions: {
            bodySizeLimit: '3mb',
        },
    },
    async redirects() {
        return [
            {
                source: '/fw',
                destination: 'https://fixitrock.com/Space',
                permanent: true,
            },
            {
                source: '/fw/:path*',
                destination: 'https://fixitrock.com/Space/:path*',
                permanent: true,
            },
            {
                source: '/drive',
                destination: 'https://fixitrock.com/Space',
                permanent: true,
            },
            {
                source: '/drive/:path*',
                destination: 'https://fixitrock.com/Space/:path*',
                permanent: true,
            },
            {
                source: '/drive/og',
                destination: '/Space/og',
                permanent: true,
            },
        ]
    },
}

export default nextConfig
