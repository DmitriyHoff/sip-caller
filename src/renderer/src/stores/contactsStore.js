import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { UserStatusGroup } from '../const'

export const useContactsStore = defineStore('contacts', () => {
    const contacts = ref([])

    async function load() {
        try {
            const response = await axios.get(`${window.api.SERVER_URL}/references/sipUsers`)
            const list = response.data
            const aList = list.map((item) => ({
                ...item,
                status_group: UserStatusGroup.getStatusGroup(item.status_id)
            }))
            console.log(aList)
            contacts.value = aList
            // sortByLastName()
            // sortByStatus()
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

    // function getStatusGroup(statusId) {
    //     let res
    //     if ([1].includes(statusId)) res = 1
    //     if ([-1, -2, -3, -4].includes(statusId)) res = 2
    //     if ([null, 0, 2, 3].includes(statusId)) res = 3
    //     return res
    // }

    // function sortByLastName() {
    //     contacts.value.sort((a, b) =>
    //         a.last_name > b.last_name ? 1 : b.last_name > a.last_name ? -1 : 0
    //     )
    // }
    // function sortByStatus() {
    //     contacts.value.sort((a, b) =>
    //         getStatusGroup(a.status_id) > getStatusGroup(b.status_id)
    //             ? -1
    //             : getStatusGroup(b.status_id) > getStatusGroup(a.status_id)
    //               ? 1
    //               : 0
    //     )
    // }

    return { contacts, load, updateStatus }
})
