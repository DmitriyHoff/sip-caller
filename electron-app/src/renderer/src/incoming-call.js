/* eslint-disable vue/no-reserved-component-names */
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import IncomingCall from './AppIncomingCall.vue'

import Avatar from 'primevue/avatar'
import Button from 'primevue/button'

import './assets/css/normalize.css'
import 'primevue/resources/themes/lara-light-green/theme.css'
//import 'primevue/resources/themes/lara-dark-green/theme.css'
import 'primeflex/primeflex.scss'
import 'primeicons/primeicons.css'

var windowTopBar = document.createElement('div')
windowTopBar.style.width = '100%'
windowTopBar.style.height = '30px'
windowTopBar.style.backgroundColor = '#000'
windowTopBar.style.position = 'absolute'
windowTopBar.style.top = windowTopBar.style.left = 0
windowTopBar.style.webkitAppRegion = 'drag'
windowTopBar.style.opacity = 0
document.body.appendChild(windowTopBar)
const app = createApp(IncomingCall)
app.use(PrimeVue)

app.component('Button', Button)
app.component('Avatar', Avatar)
app.mount('#app')
