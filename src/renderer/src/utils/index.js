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

function stringToInitials(str) {
    const names = str.split(' ')
    let initials = names[0].substring(0, 1).toUpperCase()

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
    }
    return initials
}
export { timeout, setDarkTheme, setThemeDependency, stringToColor, stringToInitials }
