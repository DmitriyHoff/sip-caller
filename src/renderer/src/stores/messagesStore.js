import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SocketMessage } from '../classes/SocketMessage'
import { Queue } from '../classes/Queue'

export const useMessagesStore = defineStore('messages', () => {
    /** Подключение к WebSocket */
    const socket = ref(null)
    const messages = ref(new Queue())
    const onIncomingMessage = ref(null)
    function connectSocket() {
        socket.value = new WebSocket(window.api.WEB_SOCKET_SERVER)
        socket.value.onmessage = async (msg) => {
            try {
                const parseJSON = JSON.parse(msg.data)
                const { type } = parseJSON
                const { dt, data } = parseJSON
                const dataJSON = data || dt

                switch (type.app) {
                    case 'all':
                        break
                    case 'tablo':
                        switch (type.module) {
                            case 'main_info':
                                messages.value.push(new SocketMessage(dataJSON))

                                if (typeof onIncomingMessage.value === 'function')
                                    onIncomingMessage.value()
                                break
                        }
                        break
                    case 'app':
                        break
                }
            } catch (error) {
                console.log(error)
                console.log(msg)
            }
        }
    }
    return { connectSocket, messages, onIncomingMessage }
})
