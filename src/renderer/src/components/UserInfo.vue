<script setup>
import { ref } from 'vue'
import UserAvatar from './UserAvatar.vue'

const props = defineProps({
    userName: String,
    statusId: Number,
    phoneNumber: Number
})
</script>

<template>
    <div class="flex align-items-center">
        <div class="flex align-items-start mr-3 gap-3">
            <UserAvatar :name="props.userName" :status-id="props.statusId" />
            <div class="flex flex-column h-full align-items-start line-height-1 gap-2">
                <p class="text-primary flex p-0 m-0 font-bold">{{ userName }}</p>
                <p class="p-0 m-0">{{ phoneNumber }}</p>
            </div>
        </div>
    </div>
</template>
