export function Name(name: string) {
    return name.replace(/^\d{4}-\d{2}-\d{2}-|\.[^.]+$/g, '')
}

export function Date(date: string) {
    const match = date.match(/^\d{4}-\d{2}-\d{2}/)

    return match ? match[0] : ''
}

export function Path(name: string) {
    return name.replace(/\.[^.]+$/, '')
}
