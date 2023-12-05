<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import delegate from './su-delegate'

const URI = 'sip:200@gippars.ru'
const LOGIN = '200'
const PASSWORD = 'Hatr8Qhb!h122Qr'
const WS_SERVER = 'wss://gippars.ru:4443/ws'

import { Web } from "sip.js";
const audio = new Audio()


// Options for SimpleUser
const options = {
    aor: URI,
    delegate,
    media: {
        constraints: {
            audio: true,
            video: false
        },
        remote: { audio }
    },
    userAgentOptions: {
        authorizationUsername: LOGIN,
        authorizationPassword: PASSWORD,
        userAgentString: 'BaltAssistanсe CallCenter 0.0.1',
        logBuiltinEnabled: false, // отключаю логирование
        logConfiguration: false,
        // sessionDescriptionHandlerFactoryOptions: {
        //     iceGatheringTimeout: 500, //currently, the smallest allowed value
        //     peerConnectionConfiguration: {
        //         iceServers: []
        //     }
        // }

    }
}


// Construct a SimpleUser instance
const simpleUser = new Web.SimpleUser(WS_SERVER, options);

// Connect to server and place call
simpleUser.connect()

function call(number) {
    simpleUser.call(`sip:${number}@gippars.ru`, {
        sessionDescriptionHandlerOptions: {
            constraints: { audio: true, video: false }
        },
        inviteWithoutSdp: false,
        iceCheckingTimeout: 500
    })
}
function terminate() {
    simpleUser.hangup()
}
function accept() {
  simpleUser.answer({
    sessionDescriptionHandlerOptions: {
        constraints: { audio: true, video: false}
    }
  })
}

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
