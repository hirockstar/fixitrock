import Tabs from './tabs'
export default async function Page({ params }: { params: Promise<{ gallery: string }> }) {
    const gallery = (await params).gallery

    return (
        <div className='mx-auto w-full p-1 sm:p-4 2xl:px-[10%]'>
            <Tabs gallery={gallery} />
        </div>
    )
}
