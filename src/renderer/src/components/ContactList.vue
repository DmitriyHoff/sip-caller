<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ref } from 'vue'
import contacts from '../data/contactsList.js'

const products = ref(contacts)
products.value.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
const selectedUser = ref(null)
</script>

<template>
    <DataTable
        v-model:selection="selectedUser"
        :value="products"
        selection-mode="single"
        data-key="id"
        class="p-datatable-sm text-xs w-full overflow-y-auto"
        row-group-mode="subheader"
        group-rows-by="status.text"
        sort-mode="single"
        sort-field="status.id"
        :sort-order="1"
        scrollable
        scroll-height="100%"
    >
        <Column field="status.text" header=""></Column>
        <Column field="status-icon" header=" ">
            <template #body="{ data }">
                <i
                    class="pi"
                    :class="{
                        'pi-circle-fill text-green-500 text-xs': data.status.id == 1,
                        'pi-circle-fill text-orange-400 text-xs': data.status.id == 2,
                        'pi-circle text-red-400 text-xs': data.status.id == 3
                    }"
                ></i>
            </template>
        </Column>
        <Column field="name" header="Имя"></Column>
        <Column field="phone" header="Номер">
            <template #body="{ data }">
                <span class="phone text-sm">{{ data.phone }}</span>
            </template>
        </Column>
        <Column field="post" header="Должность"></Column>
        <template #groupheader="slotProps">
            <div class="flex align-items-center gap-2 w-full">
                <span>{{ slotProps.data.status.text }}</span>
            </div>
        </template>
    </DataTable>
</template>

<style scoped>
.phone {
    font-weight: 700;
    font-family: 'Lucida Console', Courier, monospace;
}
</style>
