import { ImageResponse } from 'next/og'

import { getProfile } from '®actions/user/profile'

type FontOptions = {
    name: string
    data: Buffer
    weight: 400 | 600
    style: 'normal'
}
async function loadAssets(): Promise<FontOptions[]> {
    try {
        const [{ base64Font: normal }, { base64Font: mono }, { base64Font: semibold }] =
            await Promise.all([
                import('../../../og/geist-regular-otf.json').then((mod) => mod.default || mod),
                import('../../../og/geistmono-regular-otf.json').then((mod) => mod.default || mod),
                import('../../../og/geist-semibold-otf.json').then((mod) => mod.default || mod),
            ])

        return [
            { name: 'Geist', data: Buffer.from(normal, 'base64'), weight: 400, style: 'normal' },
            { name: 'Geist Mono', data: Buffer.from(mono, 'base64'), weight: 400, style: 'normal' },
            { name: 'Geist', data: Buffer.from(semibold, 'base64'), weight: 600, style: 'normal' },
        ]
    } catch (e) {
        throw new Error(`Failed to load fonts: ${e instanceof Error ? e.message : String(e)}`)
    }
}

export async function GET(_request: Request) {
    const profile = getProfile('rockstar')
    const [fonts] = await Promise.all([loadAssets()])

    return new ImageResponse(
        (
            <div style={{ fontFamily: 'Geist Sans' }} tw='flex h-full w-full bg-black text-white'>
                <div tw='flex flex-col w-full h-full mx-auto'>
                    <img
                        alt='Cover'
                        src={(await profile).user.cover}
                        style={{
                            width: '100%',
                            height: '320px',
                            objectFit: 'cover',
                            borderBottomLeftRadius: '2rem',
                            borderBottomRightRadius: '2rem',
                        }}
                    />
                    <div tw='flex flex-col items-center justify-center -top-18'>
                        <img
                            alt='Avatar'
                            src={(await profile).user.avatar}
                            style={{
                                width: '144px',
                                height: '144px',
                                borderRadius: '100%',
                                backgroundColor: '#3f3f4666',
                                backdropFilter: 'blur(8px)',
                            }}
                        />
                        <div tw='flex flex-col items-center justify-center'>
                            <h1
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    fontSize: 50,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            >
                                Rock Star 💕
                            </h1>
                            <span
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 400,
                                    fontSize: 35,
                                    color: '#a1a1aa',
                                    marginTop: '-1rem',
                                }}
                            >
                                @rockstar
                            </span>
                            <span
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 400,
                                    fontSize: 30,
                                    color: '#a1a1aa',
                                    marginTop: '0.5rem',
                                }}
                            >
                                I wanna die in front of more then billions of people.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 628,
            fonts,
            headers: {
                'Content-Disposition': `filename=Rock Star.webp`,
            },
        }
    )
}
