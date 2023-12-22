<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Toast from 'primevue/toast'
import { ref } from 'vue'
//import contacts from '../data/contactsList.js'
import { useContactsStore } from '../stores/contactsStore'
import { storeToRefs } from 'pinia'
import { UserStatusGroup } from '../classes'
import { stringToColor, stringToInitials } from '../utils'
import SvgIcon from '@jamescoyle/vue-icon'
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
    //Arrange the difference of date in days, hours, minutes, and seconds format
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
                <Avatar
                    :label="stringToInitials(data.last_name + ' ' + data.first_name)"
                    class="mr-2"
                    :style="{
                        'background-color': stringToColor(data.last_name + ' ' + data.first_name),
                        color: '#ffffff'
                    }"
                >
                    <template #default>
                        <div
                            style="width: 100%; height: 100%; position: relative"
                            class="flex align-items-center w-full justify-content-center"
                        >
                            <p class="">
                                {{ stringToInitials(data.last_name + ' ' + data.first_name) }}
                            </p>

                            <svg-icon
                                class="pi pi-circle-fill border-circle text-xs custom-badge text-50 pad-1"
                                type="mdi"
                                :path="UserStatusGroup.getStatusIcon(data.status_id)"
                                :size="20"
                                :class="{
                                    'bg-green-500': UserStatusGroup.isOnline(data.status_id),
                                    'bg-orange-400': UserStatusGroup.isWork(data.status_id),
                                    'bg-yellow-400': UserStatusGroup.isLanchBreak(data.status_id),
                                    'bg-gray-400': UserStatusGroup.isOffline(data.status_id)
                                }"
                            ></svg-icon>
                            <!-- <i
                                class="pi pi-circle-fill border-circle text-xs custom-badge"
                                :class="{
                                    'text-green-500': UserStatusGroup.isOnline(data.status_id),
                                    'text-orange-400': UserStatusGroup.isWork(data.status_id),
                                    'text-yellow-400': UserStatusGroup.isLanchBreak(data.status_id),
                                    'text-gray-400': UserStatusGroup.isOffline(data.status_id)
                                }"
                            ></i> -->
                        </div>
                    </template>
                </Avatar>
            </template>
        </Column>
        <Column column-key="time" header="=">
            <template #body="{ data }">
                <span class="time">{{ time(data.status_id, data.status_dttmcr) }}</span>
            </template>
        </Column>
        <Column field="name" header="Имя">
            <template #body="{ data }">
                <span class="name">{{ data.last_name + ' ' + data.first_name }}</span>
            </template>
        </Column>
        <Column field="phone" header="Номер">
            <template #body="{ data }">
                <span class="phone">{{ data.phone_number }}</span>
            </template>
        </Column>
        <Column field="position" header="Должность"></Column>
        <template #groupheader="slotProps">
            <div class="flex align-items-center gap-2 w-full">
                <span>{{ UserStatusGroup.getStatusCaption(slotProps.data.status_id) }}</span>
            </div>
        </template>
    </DataTable>
</template>

<style scoped>
.phone {
    font-family: 'Roboto Mono' !important;
    font-weight: 700;
    font-style: normal;
}
.time {
    font-family: 'Roboto Mono' !important;
    font-size: 12px;
    text-wrap: nowrap;
}
.custom-badge {
    position: absolute;
    right: 0;
    bottom: 0;
    border: 2px solid var(--surface-a);
    transform: translate(40%, 40%);
}
.pad-1 {
    padding: 1px;
}
</style>
