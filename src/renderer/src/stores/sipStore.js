import { defineStore } from 'pinia'
import SipPhone from '../services/sip-phone'

export const useSipStore = defineStore('phone', () => {
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
    return { call, terminate, accept }
})
