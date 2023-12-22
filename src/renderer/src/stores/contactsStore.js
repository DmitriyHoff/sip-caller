import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
// import { UserStatusGroup } from '../classes'
import { useMessagesStore } from './messagesStore'
import { UserContact } from '../classes/UserContact'

export const useContactsStore = defineStore('contacts', () => {
    const messagesStore = useMessagesStore()
    const { messages } = storeToRefs(messagesStore)

    const contacts = ref([])

    async function load() {
        try {
            const response = await axios.get(`${window.api.SERVER_URL}/references/sipUsers`)
            const list = response.data
            const aList = list.map((item) => new UserContact(item))
            contacts.value = aList

            messagesStore.onIncomingMessage = () => {
                console.log('-- onIncomingMessage --')
                updateList()
            }
            while (!messages.value.isEmpty) {
                updateList()
            }
        } catch (error) {
            console.log(error)
        }
    }
    // function updateStatus(userId, status) {
    //     const item = contacts.value.find((el) => el.id_user === userId)
    //     if (item) {
    //         item.status = status
    //     }
    // }
    function updateList() {
        if (!messages.value.isEmpty) {
            const data = messages.value.pull()
            const contact = contacts.value.find((item) => item.id_user === data.id_user)
            console.log('contactsStore: ', data)
            if (contact) {
                contact.update(data)
            }
        }
    }
    return { contacts, load, /*updateStatus*/}
})
