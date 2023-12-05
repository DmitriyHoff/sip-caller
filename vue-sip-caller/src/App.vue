<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import MySipClient from './my-sip-client'

const uri = 'sip:200@gippars.ru'
const login = '200'
const password = 'Hatr8Qhb!h122Qr'
const server = 'wss://gippars.ru:4443/ws'

// UserAgent delegate
const delegate = {
    onConnect: () => {
        console.log('Connect...')
    },
    onDisconnect: (error) => {
        console.log('Disconnect: ', { error })
    },

    onInvite: (invitation) => {
        console.log('Ivitation...', { invitation })
    },

    onMessage: (message) => {
        console.log('Message ', { message })
    },

    onNotify: (notification) => {
        console.log('Notify ', { notification })
    }
}

// Моя звонилка
const phone = new MySipClient({
    uri,
    login,
    password,
    server,
    delegate
})

function call(number) {
    phone.call(`sip:${number}@gippars.ru`)
}
function terminate() {
    phone.hangUp()
}
function accept() {
  phone.answer()
}

phone.start().then(async () => phone.register())
</script>

<template>
    <header>
        <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

        <div class="wrapper">
            <HelloWorld msg="You did it!" />
        </div>
    </header>

    <main>
        <TheWelcome />
    </main>
    <button @click="call(600)">600 (Echo test)</button>
    <button @click="call(202)">202 (Second account)</button>
    <button @click="call(602)">602 (Re-call)</button>
    <button @click="terminate()">TERMINATE</button>
    <button @click="accept()">ACCEPT</button>
</template>

<style scoped>
header {
    line-height: 1.5;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }
}
</style>
