import { Setting } from './setting'

import { User } from '@/app/login/types'
import { userSession } from '@/actions/user'

export async function Settings() {
    const { user } = await userSession()

    return <Setting user={user as User} />
}
