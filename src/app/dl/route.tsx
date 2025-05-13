import { getID } from '®actions/drive'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return new Response('Missing file ID', { status: 400 })
    }

    try {
        const file = await getID(id)
        const downloadUrl = file['@microsoft.graph.downloadUrl']

        if (!downloadUrl) {
            return new Response('Download URL not found', { status: 404 })
        }

        return Response.redirect(downloadUrl, 302)
    } catch (error) {
        return new Response(error instanceof Error ? error.message : 'Internal Server Error', {
            status: 500,
        })
    }
}
