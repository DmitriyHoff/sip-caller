<script setup>
import { ref } from 'vue'
import UserAvatar from './UserAvatar.vue'

const props = defineProps({ userName: String, statusId: Number })
// const userName = ref('Гофф Дмитрий')
// const userStatus = ref(2)
</script>
<template>
    <div class="flex align-content-center align-items-center mr-3">
        <UserAvatar :name="props.userName" :status-id="props.statusId" />
        <span class="flex p-1 font-bold text-color-secondary">{{ userName }}</span>
    </div>
</template>
