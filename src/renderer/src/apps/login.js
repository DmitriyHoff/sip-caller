/* eslint-disable vue/no-reserved-component-names */
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'

import Login from '../apps-layout/AppLogin.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import ProgressSpinner from 'primevue/progressspinner'

import '../assets/css/normalize.css'
import 'primeflex/primeflex.scss'

const app = createApp(Login)
app.use(PrimeVue)

app.component('InputText', InputText)
app.component('Button', Button)
app.component('Checkbox', Checkbox)
app.component('ProgressSpinner', ProgressSpinner)

app.mount('#app')
