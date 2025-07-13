import { getUser } from '®actions/auth'
import { User } from '®app/login/types'

import { Setting } from './setting'

interface SettingsProps {
    params: {
        user: string
        slug: string
    }
}

export async function Settings({ params }: SettingsProps) {
    const user = await getUser(params.user)

    return <Setting user={user as User} />
}
