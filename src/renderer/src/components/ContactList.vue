<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ref } from 'vue'
//import contacts from '../data/contactsList.js'
import { useContactsStore } from '../stores/contactsStore'
import { storeToRefs } from 'pinia'

const contactsStore = useContactsStore()
const { contacts } = storeToRefs(contactsStore)
const products = ref(contacts)
products.value.sort((a, b) => (a.last_name > b.last_name ? 1 : b.last_name > a.last_name ? -1 : 0))
products.value.sort((a, b) =>
    getStatusSort(a.status_id) > getStatusSort(b.status_id)
        ? -1
        : getStatusSort(b.status_id) > getStatusSort(a.status_id)
          ? 1
          : 0
)
console.log(products)
const selectedUser = ref(null)

function getStatusCaption(statusId) {
    if ([1].includes(statusId)) return 'Присутствуют'
    if ([-1, -2, -3, -4].includes(statusId)) return 'Временно недоступны'
    if ([null, 0, 2, 3].includes(statusId)) return 'Отсутствуют'
}
function getStatusSort(statusId) {
    let res
    if ([1].includes(statusId)) res = 1
    if ([-1, -2, -3, -4].includes(statusId)) res = 0
    if ([null, 0, 2, 3].includes(statusId)) res = -1
    return res
}
</script>
<!-- group-rows-by="status_sort"
        sort-mode="single"
        sort-field="status_sort"
        :sort-order="-1" -->
<template>
    <DataTable
        v-model:selection="selectedUser"
        :value="products"
        selection-mode="single"
        data-key="id"
        class="p-datatable-sm text-sm w-full overflow-y-auto"
        row-group-mode="subheader"
        :group-rows-by="(data) => getStatusSort(data.status_id)"
        sort-mode="single"
        scrollable
        scroll-height="100%"
    >
        <Column field="status-icon" header=" ">
            <template #body="{ data }">
                <i
                    class="pi"
                    :class="{
                        'pi-circle-fill text-green-500 text-xs': [1].includes(data.status_id),
                        'pi-circle-fill text-orange-400 text-xs': [-1, -2, -3, -4].includes(
                            data.status_id
                        ),
                        'pi-circle text-red-400 text-xs': [null, 0, 2, 3].includes(data.status_id)
                    }"
                ></i>
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
        <Column field="post" header="Должность"></Column>
        <template #groupheader="slotProps">
            <div class="flex align-items-center gap-2 w-full">
                <span>{{ getStatusCaption(slotProps.data.status_id) }}</span>
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
</style>
