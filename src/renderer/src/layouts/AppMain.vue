<script setup>
import TabMenu from 'primevue/tabmenu'
import { ref } from 'vue'
import router from '../router'
import { useSipStore } from '../stores/sipStore'
import { timeout } from '../utils'
// ✨
const store = useSipStore()
const login = ref(null)
const pass = ref(null)

// попытка авторизоваться
window.api.onLoginAuthorize(async (data) => {
    login.value = data.login
    pass.value = data.password
    await timeout(3000)
    try {
        await store.start()
        console.log('connected...')
        await timeout(10000)
        await store.register()
        console.log('registered...')
    } catch (err) {
        console.log({ err })
    }
})
// store.call(600)

const items = ref([
    {
        label: 'Главная',
        icon: 'pi pi-home',
        command: () => {
            console.log('click menu 1!')
            router.push({ name: 'home' })
        }
    },
    {
        label: 'Статистика',
        icon: 'pi pi-chart-line',
        command: () => {
            console.log('click menu 2!')
            router.push({ name: 'stats' })
        }
    },
    {
        label: 'История',
        icon: 'pi pi-list',
        command: () => {
            router.push({ name: 'history' })
        }
    },
    {
        label: 'Сообщения',
        icon: 'pi pi-inbox',
        command: () => {
            router.push({ name: 'messages' })
        }
    }
])
</script>

<template>
    <div class="flex h-full w-full flex-column">
        <div class="flex-none card text-sm">
            <TabMenu :model="items" />
        </div>
        <router-view />
    </div>
</template>
