const useHidden = (driveItem: { name: string }) => {
    const hiddenItems = process.env.VERCEL_HIDDEN
    const rgx = new RegExp(`^(${hiddenItems})$`, 'i')

    return rgx.test(driveItem.name)
}

export default useHidden
