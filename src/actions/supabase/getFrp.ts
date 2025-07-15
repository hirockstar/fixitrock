import { createClient } from '®supabase/server'
import { FRP } from '®types/frp'

export async function getFrp(): Promise<FRP[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('frp')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error

    return data as FRP[]
}
