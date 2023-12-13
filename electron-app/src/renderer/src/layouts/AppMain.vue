<script setup>
import TabMenu from 'primevue/tabmenu'
import SipPhone from '../services/sip-phone'
import { ref } from 'vue'
import router from '../router'

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
