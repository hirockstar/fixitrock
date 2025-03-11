import Profile from './components/@profile'
import Tabs from './components/@tabs'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Profile />
            <div className='mx-auto -mt-12 w-full space-y-4 lg:px-[10%]'>
                <div className='sticky top-0 z-20 w-full bg-background py-0.5'>
                    <Tabs />
                </div>
                {children}
            </div>
        </div>
    )
}
