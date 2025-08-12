import { Client } from '@microsoft/microsoft-graph-client'

import { getToken } from '@/actions/drive'

export const DriveClient = async () => {
    const accessToken = await getToken()

    return Client.init({
        authProvider: (done) => done(null, accessToken),
    })
}
