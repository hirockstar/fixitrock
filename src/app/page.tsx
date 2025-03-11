import { Firmware, FRP, Quotes } from '®/components/showcase/home'

export default function Home() {
    return (
        <div className='mx-auto space-y-4 pb-10 2xl:px-[10%]'>
            <Firmware />
            <FRP />
            <Quotes />
        </div>
    )
}
