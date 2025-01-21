'use server'
import { createClient } from '®/supabase/server'
import { z } from 'zod'

export async function getData(tableName: string) {
    const tableSchema = z.string().min(1, 'Table name cannot be empty')
    const parsedTableName = tableSchema.parse(tableName)

    const supabase = await createClient()

    const { data, error } = await supabase.from(parsedTableName).select('*')

    if (error) {
        throw new Error(`Failed to fetch data from table "${parsedTableName}": ${error.message}`)
    }

    return data
}
