import Profile from '®/components/user/cards/profile'
import Tabs from '®/components/user/tabs'

const user = {
    name: 'Rock Star',
    username: 'rockstar',
    bio: 'I am a Rockstar',
    location: 'Mars',
    birthdate: '',
    number: '',
    followers: 0,
    following: 0,
    gender: 'male',
}

export default async function rockstar() {
    return (
        <div>
            <Profile user={user} />
            <div className='mx-auto -mt-12 w-full lg:px-[10%]'>
                <Tabs username={'rockstar'} />
            </div>
        </div>
    )
}
