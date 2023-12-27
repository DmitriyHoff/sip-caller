import { usePrimeVue } from 'primevue/config'

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function setDarkTheme(PrimeVue, enabled) {
    if (enabled === true) {
        PrimeVue.changeTheme('lara-light-blue', 'lara-dark-blue', 'theme-link', () => {})
        console.log('theme changed to dark!')
    } else {
        console.log('theme changed to light!')
        PrimeVue.changeTheme('lara-dark-blue', 'lara-light-blue', 'theme-link', () => {})
    }
}

function setThemeDependency() {
    const PrimeVue = usePrimeVue()

    // выбор темы в соответствии с системной
    window.api.shouldUseDarkColors().then((val) => {
        setDarkTheme(PrimeVue, val)
    })

    // обработчик изменения системной темы
    window.api.onNativeThemeUpdated((val) => {
        console.log('Theme updated: ', { val })
        setDarkTheme(PrimeVue, val)
    })
}

/** Генерирует `hash` с соответствующим строке цветом
 * @param {String} str Строка для генерации цвета
 */
function stringToColor(str) {
    let hash = 0
    let color = '#'

    if (!str) {
        return color + '333333'
    }

    const strLength = str.length

    for (let i = 0; i < strLength; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        color += ('00' + value.toString(16)).slice(-2)
    }

    return color
}

/**
 * Вовращает инициалы в фомате `XX` на основе строки
 * @param {String} str Строка с именем
 * @returns Инициалы на основе строки
 */
function stringToInitials(str) {
    if(!str) return null
    const names = str.split(' ')
    let initials = names[0].substring(0, 1).toUpperCase()

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
    }
    return initials
}
/**
 * Возвращает относительную яркость цвета
 * @param {String} colorHash hash-строка цвета в формате
 */
function getColorRelativeLuminance(colorHash) {
    const match = colorHash.substring(1).match(/.{1,2}/g)

    const [R, G, B] = match
    const red = parseInt(R, 16)
    const green = parseInt(G, 16)
    const blue = parseInt(B, 16)

    const relativeLuminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
    return relativeLuminance
}

/**
 * Формирует временной интервал на основе разницы двух дат
 * @param {Number} difference
 * @returns Строка вида 00:00:00
 */
function formatDate(difference) {
    // Arrange the difference of date in days, hours, minutes, and seconds format
    let days = Math.floor(difference / (1000 * 60 * 60 * 24))
    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = Math.floor((difference % (1000 * 60)) / 1000)
    let total = ''
    if (days > 0) total += days + 'д '
    if (hours > 0 && days > 0) total += hours + ':'
    total += minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
    return total
}
export {
    timeout,
    setDarkTheme,
    setThemeDependency,
    stringToColor,
    stringToInitials,
    getColorRelativeLuminance,
    formatDate
}
