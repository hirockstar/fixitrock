import { ImageResponse } from 'next/og'

import { siteConfig } from '®/config/site'
import { formatCount, formatDateTime, formatBytes } from '®/lib/utils'

import { getMeta } from '®actions/drive/meta'

export const runtime = 'edge'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')?.split(' ') || []
    const data = await getMeta(slug.join('/'))

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(360deg, #00000,  #222222)',
                    padding: '48px',
                    fontFamily: 'Inter',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <img
                        alt='Fix iT Rock'
                        src='https://fixitrock.com/icons/fixitrock.png'
                        style={{
                            width: '70px',
                            height: '70px',
                        }}
                    />
                </div>

                {/* Main Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        alignItems: 'center',
                        gap: '32px',
                    }}
                >
                    {/* Centered Thumbnail with 3D-like Effect */}
                    <div
                        style={{
                            width: '250px',
                            height: '250px',
                            borderRadius: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background:
                                'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                            boxShadow:
                                '0 8px 32px rgba(0,0,0,0.2), 0 -2px 8px rgba(255,255,255,0.1)',
                            overflow: 'hidden',
                            position: 'relative',
                            padding: 20,
                        }}
                    >
                        {/* Top highlight for 3D effect */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background:
                                    'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
                            }}
                        />
                        <img
                            alt={data.name}
                            src={
                                data.thumbnails?.[0]?.large?.url ||
                                `${siteConfig.domain}/icons/fallback.png`
                            }
                            style={{
                                objectFit: 'contain',
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </div>

                    {/* Title below image */}
                    <div
                        style={{
                            fontSize: 48,
                            fontWeight: 700,
                            color: '#fff',
                            textAlign: 'center',
                            letterSpacing: '-0.025em',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        {data.name}
                    </div>

                    {/* Stats */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '24px',
                            width: '100%',
                            marginTop: 'auto',
                        }}
                    >
                        {[
                            { icon: '📁', value: formatCount(data.folder?.childCount || 0) },
                            { icon: '💾', value: formatBytes(data.size || 0) },
                            { icon: '🕒', value: formatDateTime(data.lastModifiedDateTime) },
                            // { icon: '👁️', value: '1,234' },
                            // { icon: '⬇️', value: '567' },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background:
                                        'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                                    padding: '10px 20px',
                                    borderRadius: '24px',
                                    color: '#fff',
                                    fontSize: 24,
                                    fontWeight: 600,
                                    lineHeight: 1.4,
                                    flex: 1,
                                    minWidth: 0,
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                                    textAlign: 'center',
                                }}
                            >
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {stat.icon} {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Rainbow Line */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '8px',
                        background: 'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
                    }}
                />
            </div>
        ),
        {
            width: 1200,
            height: 600,
            headers: {
                'Content-Disposition': `filename=${data.name}.png`,
            },
        }
    )
}

{
    /* Background Glow */
}
{
    /* <div
    style={{
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: '600px',
        height: '600px',
        background:
            'radial-gradient(circle, rgba(50,50,150,0.3) 0%, rgba(20,20,50,0) 80%)', // Darker, richer blue glow
        filter: 'blur(80px)', // Adds smoothness to the glow
    }}
/>
<div
    style={{
        position: 'absolute',
        bottom: '10%',
        right: '20%',
        width: '400px',
        height: '400px',
        background:
            'radial-gradient(circle, rgba(150,50,100,0.3) 0%, rgba(50,20,30,0) 80%)', // Deep reddish-purple glow
        filter: 'blur(80px)', // Matches the smoothness of the other glow
    }}
/> */
}
