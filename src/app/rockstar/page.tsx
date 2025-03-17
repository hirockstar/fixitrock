import Profile from './ui/profile'
import Tabs from './ui/tabs'

export default function Page() {
    return (
        <main>
            <Profile />
            <div className='mx-auto -mt-12 p-1 2xl:px-[10%]'>
                <Tabs />
            </div>
        </main>
    )
}
