export function bucketUrl(src: string) {
    if (!src) return ''

    return process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public' + src
}
