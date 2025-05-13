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

const slangPhrases = [
    'Kaale se dar gaye kya? 😱',
    'Kya scene hai, bhai? 😎',
    'Dil se mat khel, yaar. ❤️',
    'Wah bhai wah, kya baat hai! 👏',
    'Bhai ki jaan, ab kya karega? 🤔',
    'Aaj toh maza aa gaya! 🎉',
    'Chill maar, sab theek hai. 😌',
    'Yeh toh badiya hai, boss! 👍',
    'Kya mast hai yaar! 😄',
    'Kya bakra hai yaar! 🐐',
    'Kya kar raha hai tu, bhai? 🤷‍♂️',
    'Tumhare bina sab suna suna hai. 😢',
    'Bindaas reh, sab theek ho jayega. 😇',
    'Mast hai yaar, full on entertainment! 🎭',
    'Chalo, ghoomte hain thoda! 🚗',
    'Aaj toh party banti hai! 🎊',
    'Kya khichdi pak rahi hai? 🍲',
    'Dil se bolo, kya chahiye? 🗣️',
    'Bhai, tu toh superstar hai! 🌟',
    'Kya scene hai, party kab hai? 🎈',
    'Aaj toh chhutti hai, chill maar! 🏖️',
    'Yeh toh zabardast hai! 🔥',
    'Masti karne ka time hai! 🎉',
    'Kya baat hai, mast lag raha hai! 😍',
    'Aaj toh sab mast hai! 🎶',
]

export const randomSlang = () => {
    const randomIndex = Math.floor(Math.random() * slangPhrases.length)

    return slangPhrases[randomIndex]
}
