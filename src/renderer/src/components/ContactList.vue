<script setup>
import UserAvatar from './UserAvatar.vue'

import { ref } from 'vue'
import { useContactsStore } from '../stores/contactsStore'
import { storeToRefs } from 'pinia'
import { UserStatusGroup } from '../classes/UserStatusGroup'
import { useToast } from 'primevue/usetoast'
import { formatDate } from '../utils'
import { FilterMatchMode, FilterOperator } from 'primevue/api'

const contactsStore = useContactsStore()
const { contacts } = storeToRefs(contactsStore)

/** Развёрнутые группы в таблице */
const expandedRowGroups = ref([1, 2, 3])

/** Фильтры */
const filters = ref({
    global: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH
    }
})
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
        v-model:expandedRowGroups="expandedRowGroups"
        v-model:filters="filters"
        :global-filter-fields="['last_name', 'first_name']"
        :value="contacts"
        expandable-row-groups
        selection-mode="single"
        data-key="id_user"
        class="p-datatable-sm text-sm w-full overflow-y-auto no-header"
        row-group-mode="subheader"
        group-rows-by="status_group_id"
        sort-mode="multiple"
        :multi-sort-meta="multiSort"
        @row-click="
            (e) => {
                console.log('click!')
                show()
            }
        "
    >
        <template #header>
            <div class="flex flex-wrap w-full align-items-center justify-content-between gap-2">
                <div class="flex text-sm text-900">Поиск:</div>
                <div class="flex flex-grow-1 p-0">
                    <InputText
                        v-model="filters['global'].value"
                        placeholder="Найти..."
                        type="text"
                        size="small"
                        class="w-full"
                    />
                </div>
            </div>
        </template>
        <template #groupheader="slotProps">
            <div
                class="rowgroup-header-title"
                :class="{
                    'bg-green-500': UserStatusGroup.isOnline(slotProps.data.status_id),
                    'bg-orange-400': UserStatusGroup.isWork(slotProps.data.status_id),
                    'bg-yellow-400': UserStatusGroup.isLanchBreak(slotProps.data.status_id),
                    'bg-gray-400': UserStatusGroup.isOffline(slotProps.data.status_id)
                }"
            >
                <span>{{ UserStatusGroup.getStatusGroupTitle(slotProps.data.status_id) }}</span>
            </div>
        </template>
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
    </DataTable>
</template>

<style>
.p-datatable-thead {
    display: none !important;
}
.p-row-toggler {
    border-radius: 6px;
}
.rowgroup-header-title {
    display: inline-flex;
    justify-content: center;
    align-content: center;
    line-height: 100%;
    font-size: 1rem;
    align-content: center;
    margin-bottom: 0.6rem;
}
.p-rowgroup-header td {
    font-size: 0;
    line-height: 0;
    padding: 0;
    height: 0;
    border-radius: 6px;
    user-select: none;
}
.p-rowgroup-header td:has(> .bg-orange-400) {
    background-color: var(--orange-400);
}
.p-rowgroup-header td:has(> .bg-yellow-400) {
    background-color: var(--yellow-400);
}
.p-rowgroup-header td:has(> .bg-gray-400) {
    background-color: var(--gray-400);
}
.p-rowgroup-header td:has(> .bg-green-500) {
    background-color: var(--green-500);
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
