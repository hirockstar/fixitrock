'use client'

import { DiOnedrive } from 'react-icons/di'
import { LiaGhostSolid } from 'react-icons/lia'
import { GiGhost } from 'react-icons/gi'

import { useDrive } from '®tanstack/query'
import { ErrorState } from '®ui/state'

import { Grid } from '../ui'

export function Drive() {
    const { data, isLoading, selectItem, error } = useDrive('')

    return (
        <>
            {error && (
                <ErrorState
                    icons={[GiGhost, DiOnedrive, LiaGhostSolid]}
                    message={error.message}
                    title='Bruh... Where Did the Files Go? 🧐'
                />
            )}
            <Grid data={data} isLoading={isLoading} onSelect={selectItem} />
        </>
    )
}
