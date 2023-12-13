import Home from '../views/Home.vue'
import Stats from '../views/Stats.vue'
import History from '../views/History.vue'
import Messages from '../views/Messages.vue'

export default [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/stats',
        name: 'stats',
        component: Stats
    },
    {
        path: '/history',
        name: 'history',
        component: History
    },
    {
        path: '/messages',
        name: 'messages',
        component: Messages
    }
]
