import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const contactsStore = defineStore('contacts', () => {
    const contacts = ref([])

    async function load() {
        try {
            const response = await axios.get(`${window.api.SERVER_URL}/references/sipUsers`)
            contacts.value = response.data
        } catch (error) {
            console.log(error)
        }
    }
    function updateStatus(userId, status) {
        const item = contacts.value.find((el) => el.id_user === userId)
        if (item) {
            item.status = status
        }
    }
    return { contacts, load, updateStatus }
})
