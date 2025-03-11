export default function Layout({
    firmware,
    frp,
    quotes,
    children,
}: {
    firmware: React.ReactNode
    frp: React.ReactNode
    quotes: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <div className='mx-auto my-4 flex flex-1 flex-col space-y-10 pb-10 2xl:px-[10%]'>
            {firmware}
            {frp}
            {quotes}
            {children}
        </div>
    )
}
