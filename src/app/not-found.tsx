'use client'

import { FC } from 'react'
import { Button } from '@heroui/react'

const NotFound: FC = () => {
    return (
        <div className='mx-auto w-full max-w-7xl'>
            <div className='flex h-[80svh] items-center justify-center'>
                <div className='text-center'>
                    <h1 className='my-4 text-3xl font-bold sm:text-6xl'>
                        ये तो गड़बड़ हैं रे बाबा!
                    </h1>
                    {/* <p className="mb-8 text-xl">
            Oops! It seems like you&apos;ve ventured into uncharted territory.
          </p> */}
                    <Button color='primary' radius='full' href='/'>
                        तू जा रे!
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NotFound
