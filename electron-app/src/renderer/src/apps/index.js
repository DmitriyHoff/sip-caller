import { createApp } from 'vue'
import PrimeVue from 'primevue/config'

import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import SplitButton from 'primevue/splitbutton'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import router from '../router'
import App from '../layouts/AppMain.vue'

import '../assets/css/normalize.css'
import 'primevue/resources/themes/lara-light-green/theme.css'
//import 'primevue/resources/themes/lara-dark-green/theme.css'
import 'primeflex/primeflex.scss'
import 'primeicons/primeicons.css'

const app = createApp(App)
app.use(PrimeVue)
app.use(router)

app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)
app.component('InputText', InputText)
app.component('Button', Button)
app.component('Checkbox', Checkbox)
app.component('Textarea', Textarea)
app.component('SplitButton', SplitButton)
app.component('DataTable', DataTable)
app.component('Column', Column)

app.mount('#app')
