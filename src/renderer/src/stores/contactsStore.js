import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useContactsStore = defineStore('contacts', () => {
    const contacts = ref([])

    async function load() {
        try {
            const response = await axios.get(`${window.api.SERVER_URL}/references/sipUsers`)
            contacts.value = response.data
        } catch (error) {
            console.log(error)
        }
    }
    // function formatArray(data) {
    //     data.map((item) => {
    //         const name = `${item.last_name} ${item.middle_name ? `${item.middle_name} ` : ''}${item.first_name}`
    //         const phone = item
    //         return {
    //             name,
    //         }
    //     })
    // }
    function updateStatus(userId, status) {
        const item = contacts.value.find((el) => el.id_user === userId)
        if (item) {
            item.status = status
        }
    }
    return { contacts, load, updateStatus }
})
