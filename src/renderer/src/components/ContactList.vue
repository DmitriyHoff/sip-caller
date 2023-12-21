<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import { ref } from 'vue'
//import contacts from '../data/contactsList.js'
import { useContactsStore } from '../stores/contactsStore'
import { storeToRefs } from 'pinia'
import { UserStatusGroup } from '../const'
import { stringToColor, stringToInitials } from '../utils'
import SvgIcon from '@jamescoyle/vue-icon'

const contactsStore = useContactsStore()
const { contacts } = storeToRefs(contactsStore)
const products = ref(contacts)

console.log(products)
const selectedUser = ref(null)
</script>

<template>
    <DataTable
        v-model:selection="selectedUser"
        :value="products"
        selection-mode="single"
        data-key="id_user"
        class="p-datatable-sm text-sm w-full overflow-y-auto"
        row-group-mode="subheader"
        group-rows-by="status_group"
        sort-field="status_group"
        scrollable
        scroll-height="100%"
    >
        <Column field="status_group" header="!"></Column>
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
    font-family: 'RobotoMono' !important;
    font-weight: 700;
    font-style: normal;
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
