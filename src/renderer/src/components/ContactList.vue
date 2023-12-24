<script setup>
import UserAvatar from './UserAvatar.vue'
import Toast from 'primevue/toast'
import { ref } from 'vue'
import { useContactsStore } from '../stores/contactsStore'
import { storeToRefs } from 'pinia'
import { UserStatusGroup } from '../classes'
import { useToast } from 'primevue/usetoast'

const contactsStore = useContactsStore()
const { contacts } = storeToRefs(contactsStore)

// Запускаем таймер
const currentTime = ref(null)
setInterval(() => {
    currentTime.value = new Date()
}, 1000)

const toast = useToast()
const show = () => {
    toast.add({ severity: 'info', summary: 'Info', detail: currentTime.value, life: 3000 })
}
console.log(contacts)
const selectedUser = ref(null)

// параметры сортировки таблицы
const multiSort = ref([
    { field: 'status_group_id', order: 1 },
    { field: 'last_name', order: 1 },
    { field: 'first_name', order: 1 }
])

function isDate(dataTimeString) {
    const date = Date.parse(dataTimeString)
    return !Number.isNaN(date)
}
function time(statusId, dataTimeString) {
    if (UserStatusGroup.isOffline(statusId)) return null

    if (isDate(dataTimeString)) {
        const res = currentTime.value - Date.parse(dataTimeString)
        const format = formatDate(res)
        return format
    }
    return null
}

function formatDate(difference) {
    // Arrange the difference of date in days, hours, minutes, and seconds format
    let days = Math.floor(difference / (1000 * 60 * 60 * 24))
    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = Math.floor((difference % (1000 * 60)) / 1000)
    let total = ''
    if (days > 0) total += days + 'д '
    if (hours > 0 && days > 0) total += hours + ':'
    total += minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
    return total
}
const getV = () => {
    const r = Object.assign({}, currentTime)
    console.log(r)
    return r
}
</script>

<template>
    <Toast position="bottom-right">
        <template #message="slotProps"> {{ 'ffs' + getV()._value }}</template>
    </Toast>
    <DataTable
        v-model:selection="selectedUser"
        :value="contacts"
        selection-mode="single"
        data-key="id_user"
        class="p-datatable-sm text-sm w-full overflow-y-auto"
        row-group-mode="subheader"
        group-rows-by="status_group_id"
        sort-mode="multiple"
        :multi-sort-meta="multiSort"
        scrollable
        scroll-height="100%"
        @row-click="
            (e) => {
                console.log('click!')
                show()
            }
        "
    >
        <Column field="status_group_id" header="!"></Column>
        <Column field="avatar" header="">
            <template #body="{ data }">
                <UserAvatar
                    :name="data.last_name + ' ' + data.first_name"
                    :status-id="data.status_id"
                />
            </template>
        </Column>
        <Column column-key="time" header="=">
            <template #body="{ data }">
                <span class="time">{{ time(data.status_id, data.status_dttmcr) }}</span>
            </template>
        </Column>
        <Column field="name" header="Имя">
            <template #body="{ data }">
                <span class="name m-0 text-color">{{ data.last_name + ' ' + data.first_name }}</span>
                <p class="text-xs text-color-secondary m-0 p-0 py-1">{{ data.position }}</p>
            </template>
        </Column>
        <Column field="phone" header="Номер">
            <template #body="{ data }">
                <span class="phone">{{ data.phone_number }}</span>
            </template>
        </Column>
        <!-- <Column field="position" header="Должность"></Column> -->
        <template #groupheader="slotProps">
            <div class="flex align-items-center gap-2 w-full">
                <span>{{ UserStatusGroup.getStatusCaption(slotProps.data.status_id) }}</span>
            </div>
        </template>
    </DataTable>
</template>

<style scoped>
.phone {
    font-family: 'RobotoMono' !important;
    font-weight: 700;
    font-style: normal;
}
.time {
    font-family: 'RobotoMono' !important;
    font-size: 12px;
    text-wrap: nowrap;
}
</style>
