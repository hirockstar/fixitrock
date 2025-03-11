import { Firmware, Quotes } from '®/components/showcase/home'

export default function Home() {
    return (
        <div className='mx-auto w-full space-y-4 p-1 py-4 sm:p-4 2xl:px-[10%]'>
            <Firmware />
            <Quotes />
        </div>
    )
}
