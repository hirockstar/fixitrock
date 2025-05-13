// import { NextRequest, NextResponse } from 'next/server'

// const CLIENT_ID = ''
// const CLIENT_SECRET = ''
// const REDIRECT_URI = '' // ✅ Must match your Azure settings

// export async function GET(req: NextRequest) {
//     const { searchParams } = new URL(req.url)
//     const code = searchParams.get('code')

//     if (!code) {
//         // Redirect to Microsoft OAuth login
//         const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_mode=query&scope=offline_access%20https://graph.microsoft.com/.default`

//         return NextResponse.redirect(authUrl)
//     }

//     // Exchange the authorization code for an access token
//     const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'

//     const body = new URLSearchParams({
//         client_id: CLIENT_ID,
//         client_secret: CLIENT_SECRET,
//         code,
//         redirect_uri: REDIRECT_URI, // ✅ Matches Azure
//         grant_type: 'authorization_code',
//     })

//     try {
//         const response = await fetch(tokenUrl, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//             body,
//         })

//         if (!response.ok) {
//             const errorText = await response.text()

//             throw new Error(`Token exchange failed: ${errorText}`)
//         }

//         const tokens = await response.json()

//         return NextResponse.json({
//             refresh_token: tokens.refresh_token, // ✅ The refresh token you need
//             access_token: tokens.access_token,
//             expires_in: tokens.expires_in, // Access token expiry (seconds)
//         })
//     } catch (error: any) {
//         return NextResponse.json({ error: error.message }, { status: 500 })
//     }
// }
