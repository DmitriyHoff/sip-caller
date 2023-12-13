<script setup>
import TabMenu from 'primevue/tabmenu'
import SipPhone from './sip-phone'
import { ref } from 'vue'
import router from './router'

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

const { api } = window

const sipOptions = {
    uri: 'sip:202@gippars.ru',
    login: '202',
    password: 'Hatr8Qhb!h122Qr',
    server: 'wss://gippars.ru:4443/ws'
}

const delegate = {
    onConnect: () => {
        api.sendSipConnect()
        console.log('Connect...')
    },
    onDisconnect: (error) => {
        api.sendSipDisconnect(error)
        console.log('Disconnect: ', { error })
    },

    onInvite: (invitation) => {
        // this.onIncomingCall(invitation)
        api.sendSipInvite(invitation)
        console.log('Invitation...', { invitation })
    },

    onMessage: (message) => {
        api.sendSipMessage(message)
        console.log('Message ', { message })
    },

    onNotify: (notification) => {
        api.sendSipNotify(notification)
        console.log('Notify ', { notification })
    }
}
// Моя звонилка
const phone = new SipPhone(sipOptions, delegate)

function call(number) {
    phone.call(`sip:${number}@gippars.ru`)
    window.api.sendSipBeginCall()
}
function terminate() {
    phone.hangUp()
    window.api.sendSipEndCall()
}
function accept() {
    phone.answer()
}

phone.start().then(async () => phone.register())
</script>

<template>
    <div class="flex h-full w-full flex-column">
        <div class="flex-none card text-sm">
            <TabMenu :model="items" />
        </div>
        <router-view />
    </div>
</template>
