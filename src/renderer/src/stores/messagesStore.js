import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMessagesStore = defineStore('messages', () => {
    /** Подключение к WebSocket */
    const socket = ref(null)
    const messages = ref([])
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
                                console.log('Main_info: ', dataJSON)
                                messages.value.push(dataJSON)
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
    return { connectSocket, messages }
})
