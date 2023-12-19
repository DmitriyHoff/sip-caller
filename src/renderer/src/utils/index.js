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
export { timeout, setDarkTheme }
