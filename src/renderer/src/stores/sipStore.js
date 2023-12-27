import { defineStore } from 'pinia'
import { SipPhone } from '../services/sip-phone'
import { ref } from 'vue'

export const useSipStore = defineStore('phone', () => {
    const responseCallback = ref(null)

    const registererState = ref('')
    const sessionState = ref('')
    const phone = ref(null)

    const callbacks = {
        registererStateChangeListener: (state) => {
            registererState.value = state
            window.api.sendSipRegistererStateChanged(state)
        },

        sessionStateChangeListener: (state) => {
            sessionState.value = state
            window.api.sendSipSessionStateChanged(state)
        },

        responseListener: (response) => {
            if (responseCallback.value) responseCallback.value(response)
        }
    }

    

    function init(options, delegate) {
        phone.value = new SipPhone(options, delegate, callbacks)
    }

    function call(number) {
        phone.value.call(`sip:${number}@gippars.ru`)
    }

    function terminate() {
        phone.value.hangUp()
    }

    function answer() {
        phone.value.answer()
    }

    function start() {
        return phone.value.start()
    }

    function register() {
        return phone.value.register()
    }

    // function onResponse(callback) {
    //     responseCallback.value = callback
    // }

    return {
        phone,
        init,
        start,
        register,
        call,
        terminate,
        answer,
        registererState,
        sessionState,
        responseCallback
    }
})
