<script setup>
import { ref } from 'vue'
import messagesList from '../data/messagesList'

const messages = ref(messagesList)
const selectedMessage = ref(null)
</script>
<template>
    <DataTable
        v-model:selection="selectedMessage"
        :value="messages"
        selection-mode="single"
        data-key="id"
        class="p-datatable-sm text-xs w-full h-full"
        scrollable
        scroll-height="100%"
    >
        <Column field="id" header="#"></Column>
        <Column field="type" header="Тип"></Column>
        <Column field="from" header="От"></Column>
        <Column field="refid" header="Дело"></Column>
        <Column field="priority" header="Приоритетность"></Column>
        <Column field="name" header="ФИО"></Column>
        <Column field="text" header="Текст"></Column>
    </DataTable>
</template>
