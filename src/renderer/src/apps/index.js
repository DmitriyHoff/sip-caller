// import devtools from '@vue/devtools'
// devtools.connect(/* host, port */)
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import SplitButton from 'primevue/splitbutton'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ScrollPanel from 'primevue/scrollpanel'
import ProgressBar from 'primevue/progressbar'
import ToastService from 'primevue/toastservice';
import router from '../router'
import App from '../layouts/AppMain.vue'

import '../assets/css/fonts.css'
import '../assets/css/fonts-mono.css'

import '../assets/css/normalize.css'
import 'primeflex/primeflex.scss'
import 'primeicons/primeicons.css'

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue)
app.use(pinia)
app.use(router)
app.use(ToastService)

app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)
app.component('InputText', InputText)
app.component('Button', Button)
app.component('Checkbox', Checkbox)
app.component('Textarea', Textarea)
app.component('SplitButton', SplitButton)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ProgressBar', ProgressBar)
app.component('ScrollPanel', ScrollPanel)
app.component('Avatar', Avatar)
app.mount('#app')
