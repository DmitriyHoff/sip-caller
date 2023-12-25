<script setup>
import TabMenu from 'primevue/tabmenu'
import UserInfo from '../components/UserInfo.vue'
import { ref, reactive, watch } from 'vue'
import router from '../router'
import { useSipStore } from '../stores/sipStore'
import { useContactsStore } from '../stores/contactsStore' // ✨
import { useMessagesStore } from '../stores/messagesStore' // ✨
import { timeout, setThemeDependency } from '../utils'
import { ConnectionError, RegistrationError } from '../services/sip-phone' // ✨
import { storeToRefs } from 'pinia'

setThemeDependency()
const sipStore = useSipStore()
const contactsStore = useContactsStore()
const messagesStore = useMessagesStore()

const credentials = reactive({})
const token = ref(null)
const contacts = ref(null)

const { registererState, phone } = storeToRefs(sipStore)

sipStore.responseCallback = (response) => {
    console.log('APP: ', response)
    if (response?.message?.statusCode != 200) {
        const errResponse = {
            name: 'AuthenticationError',
            message: response?.reasonPhrase,
            title: 'Ошибка авторизации'
        }
        window.api.sendLoginResponse({ error: errResponse })
    } else {
        window.api.sendLoginResponse({ status: 'OK' })
    }
}

watch(registererState, (newState) => {
    console.log('State updated -> ', newState)
})

const delegate = {
    onConnect: () => {
        window.api.sendSipConnect()
        console.log('Connect')
    },
    onDisconnect: (error) => {
        window.api.sendSipDisconnect(error)
        console.log('Disconnect: ', { error })
    },
    onInvite: (invitation) => {
        console.log({ invitation })
        const { request } = invitation.incomingInviteRequest.transaction
        const params = {
            from: request?.from?.displayName,
            uri: request?.from?.uri?.user
        }
        window.api.sendSipInvite(params)
        console.log('Invitation...', { invitation })
    },
    onMessage: (message) => {
        window.api.sendSipMessage(message)
        console.log('Message ', { message })
    },
    onNotify: (notification) => {
        window.api.sendSipNotify(notification)
        console.log('Notify ', { notification })
    },
    onRegister: (register) => {
        console.log('Register ->>> ', { register })
    },
    onRegisterRequest: (reg) => {
        console.log('RegisterRequest ->>>', { reg })
    }
}

// попытка авторизоваться
window.api.onLoginRequest(async (data) => {
    Object.assign(credentials, data.credentials)
    token.value = data.token

    const sipNumber = credentials.login_id === 1572 ? 200 : 202 // тестовые номера
    const sipOptions = {
        uri: `sip:${sipNumber}@gippars.ru`,
        login: sipNumber,
        password: 'Hatr8Qhb!h122Qr',
        server: 'wss://gippars.ru:4443/ws'
    }
    sipStore.init(sipOptions, delegate)
    await timeout(500)
    try {
        await sipStore.start()
        console.log('connected...')
        await timeout(500)
        await sipStore.register()
        console.log('registered...')
        await contactsStore.load()
        messagesStore.connectSocket()
        contactsStore.load()
        // window.api.sendLoginResponse({ status: 'OK' })
    } catch (error) {
        const errResponse = {
            name: error.name,
            message: error.message,
            title: ''
        }
        switch (error.constructor) {
            case ConnectionError:
                console.log('connection error...')
                errResponse.title = 'Ошибка соединения'
                break
            case RegistrationError:
                console.log('registration error...')
                errResponse.title = 'Ошибка регистрации в сети'
                break
            default:
                console.log('error...')
                errResponse.title = 'Ошибка соединения'
                break
        }
        window.api.sendLoginResponse({ error: errResponse })
    }
})

window.api.onPhoneCancellClick(() => {
    sipStore.terminate()
    window.api.sendSipEndCall()
})
window.api.onPhoneAcceptClick(() => {
console.log('ANSWER')
    //sipStore.answer()
    window.api.sendSipBeginCall()
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
    <div class="flex h-full w-full flex-column font-roboto">
        <div class="flex-none card text-sm">
            <div class="flex flex-row justify-content-between align-content-center">
                <TabMenu :model="items" />
                <UserInfo :user-name="credentials?.login_name" :status-id="2" />
            </div>
        </div>
        <router-view />
    </div>
</template>

<style>
#app {
    font-family: 'Roboto';
    font-weight: 400;
    font-variant: normal;
}
.p-component,
.p-inputtext {
    font-family: inherit;
}
</style>
