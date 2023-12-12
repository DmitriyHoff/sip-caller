import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import App from './AppMain.vue'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

import './assets/css/normalize.css'
import 'primevue/resources/themes/lara-light-green/theme.css'
//import 'primevue/resources/themes/lara-dark-green/theme.css'
import 'primeflex/primeflex.scss'
import 'primeicons/primeicons.css'

const app = createApp(App)
app.use(PrimeVue)

app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)

app.mount('#app')
