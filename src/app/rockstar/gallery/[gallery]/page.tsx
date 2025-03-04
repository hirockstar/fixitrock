export default async function Page({ params }: { params: Promise<{ gallery: string }> }) {
    const { gallery } = await params

    return (
        <div>
            <pre>{JSON.stringify(gallery, null, 2)}</pre>
        </div>
    )
}
