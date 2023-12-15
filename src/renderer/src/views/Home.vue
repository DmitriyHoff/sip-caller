<script setup>
import ContactList from '../components/ContactList.vue'
import RefidPanel from '../components/RefidPanel.vue'
import MessagesTable from '../components/MessagesTable.vue'
</script>
<template>
    <Splitter class="flex-grow-1 border-noround overflow-auto font-roboto" layout="vertical">
        <SplitterPanel
            style="min-height: 400px"
            class="flex w-full h-full align-items-center justify-content-center overflow-auto"
        >
            <Splitter class="flex h-full border-noround">
                <SplitterPanel class="flex h-full w-full">
                    <RefidPanel />
                </SplitterPanel>
                <SplitterPanel style="min-width: 300px" class="flex h-full w-full oveflow-y-auto">
                    <ContactList />
                </SplitterPanel>
            </Splitter>
        </SplitterPanel>
        <SplitterPanel style="min-height: 200px;" class="flex align-items-center justify-content-center overflow-y-auto font-roboto">
            <MessagesTable />
        </SplitterPanel>
    </Splitter>
</template>
<style scoped>
.font-roboto {
    font-family: 'Roboto';
}
</style>