<script setup>
import TabMenu from 'primevue/tabmenu'
import { ref, watch } from 'vue'
import router from '../router'
import { useSipStore } from '../stores/sipStore'
import { timeout } from '../utils'
import { ConnectionError, RegistrationError } from '../services/sip-phone' // ✨
import { storeToRefs } from 'pinia'

const store = useSipStore()
const login = ref(null)
const pass = ref(null)

const { registererState } = storeToRefs(store)

store.responseCallback = (response) => {
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

// попытка авторизоваться
window.api.onLoginRequest(async (data) => {
    login.value = data.login
    pass.value = data.password

    await timeout(500)
    try {
        await store.start()
        console.log('connected...')
        await timeout(500)
        await store.register()
        console.log('registered...')
        //        window.api.sendLoginResponse({ status: 'OK' })
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
            <TabMenu :model="items" />
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
