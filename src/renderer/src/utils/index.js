import { usePrimeVue } from 'primevue/config'

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function setDarkTheme(PrimeVue, enabled) {
    if (enabled === true) {
        PrimeVue.changeTheme('lara-light-blue', 'lara-dark-blue', 'theme-link', () => {})
        console.log('theme changed!')
    } else {
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
export { timeout, setDarkTheme, setThemeDependency }
