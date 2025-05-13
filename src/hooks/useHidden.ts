import { env } from '®lib/env'

const useHidden = (driveItem: { name: string }) => {
    const hiddenItems = env.HIDDEN
    const rgx = new RegExp(`^(${hiddenItems})$`, 'i')

    return rgx.test(driveItem.name)
}

export default useHidden
