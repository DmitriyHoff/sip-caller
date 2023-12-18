import { defineStore } from 'pinia'
import { SipPhone } from '../services/sip-phone'
import { ref } from 'vue'

import delegate from './userAgentDelegate'

export const useSipStore = defineStore('phone', () => {
    // const sipOptions = {
    //     uri: 'sip:202@gippars.ru',
    //     login: '202',
    //     password: 'Hatr8Qhb!h122Qr',
    //     server: 'wss://gippars.ru:4443/ws'
    // }

    const responseCallback = ref(null)

    function registererStateChangeListener(state) {
        registererState.value = state
        console.log({ state })
    }

    function responseListener(response) {
        if (responseCallback.value) responseCallback.value(response)
        console.log('STORE: ', { response })
    }

    // Моя звонилка
    const phone = ref(null)

    function init(options) {
        phone.value = new SipPhone(
            options,
            delegate,
            responseListener,
            registererStateChangeListener
        )
    }

    function call(number) {
        phone.value.call(`sip:${number}@gippars.ru`)
        window.api.sendSipBeginCall()
    }

    function terminate() {
        phone.value.hangUp()
        window.api.sendSipEndCall()
    }

    function accept() {
        phone.value.answer()
    }

    function start() {
        return phone.value.start()
    }

    function register() {
        return phone.value.register()
    }

    function onResponse(callback) {
        responseCallback.value = callback
    }
    const registererState = ref('')

    return {
        phone,
        init,
        start,
        register,
        call,
        terminate,
        accept,
        registererState,
        responseCallback
    }
})
