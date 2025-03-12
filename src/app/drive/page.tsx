'use client'

import { Grid } from './ui'

import { useDrive } from '®tanstack/query'

export default function Drive() {
    const { data, isLoading, selectItem } = useDrive('')

    return <Grid data={data} isLoading={isLoading} onSelect={selectItem} />
}
