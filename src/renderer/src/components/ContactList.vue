<script setup>
import UserAvatar from './UserAvatar.vue'
import Toast from 'primevue/toast'
import { ref } from 'vue'
import { useContactsStore } from '../stores/contactsStore'
import { storeToRefs } from 'pinia'
import { UserStatusGroup } from '../classes/UserStatusGroup'
import { useToast } from 'primevue/usetoast'
import { formatDate } from '../utils'
import Tag from 'primevue/tag'

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
        class="p-datatable-sm text-sm w-full overflow-y-auto no-header"
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
                <UserAvatar :name="data.fullName" :status-id="data.status_id" />
            </template>
        </Column>
        <Column column-key="time" header="" body-style="text-align:right">
            <template #body="{ data }">
                <Tag
                    class="time text-gray-900"
                    :class="{
                        'bg-green-500': UserStatusGroup.isOnline(data.status_id),
                        'bg-orange-400': UserStatusGroup.isWork(data.status_id),
                        'bg-yellow-400': UserStatusGroup.isLanchBreak(data.status_id),
                        'bg-gray-400': UserStatusGroup.isOffline(data.status_id)
                    }"
                    >{{ time(data.status_id, data.status_dttmcr) }}</Tag
                >
            </template>
        </Column>
        <Column field="name" header="Имя">
            <template #body="{ data }">
                <span class="name m-0 text-color">{{ data.fullName }}</span>
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

<style>
.p-datatable-thead {
    display: none !important;
}
.phone {
    font-family: 'RobotoMono' !important;
    font-weight: 700;
    font-style: normal;
}
.time {
    font-family: 'RobotoMono' !important;
    font-style: normal;
    font-weight: 300;
    font-size: 10px;
    text-wrap: nowrap;
}
</style>
