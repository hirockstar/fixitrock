import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    transpilePackages: ['next-mdx-remote'],
    async redirects() {
        return [
            {
                source: '/drive',
                destination: 'https://fixitrock.com/space',
                permanent: true,
            },
            {
                source: '/drive/:path*',
                destination: 'https://fixitrock.com/space/:path*',
                permanent: true,
            },
            {
                source: '/drive/og',
                destination: '/space/og',
                permanent: true,
            },
        ]
    },
}

export default nextConfig
