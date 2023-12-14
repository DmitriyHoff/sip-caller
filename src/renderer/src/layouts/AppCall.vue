<script setup>
import { ref } from 'vue'

const callerName = ref('Caller Name +7(909)1234567')
const isAccepted = ref(false)

// ответ на звонок
function answerCall() {
    isAccepted.value = true
    window.api.sendPhoneAcceptClick()
}

// ответ на звонок
function rejectCall() {
    isAccepted.value = false
    window.api.sendPhoneCancellClick()
}
</script>

<template>
    <div
        class="flex flex-row flex-nowrap align-items-stretch justify-content-between surface-500 w-full h-full p-1"
    >
        <div class="flex align-items-center justify-content-center m-2">
            <Avatar label="IT" size="large" />
        </div>

        <div class="flex align-items-center justify-content-center m-2">
            <span class="font-light text-white text-xl">{{ callerName }}</span>
        </div>
        <div class="flex align-items-center justify-content-center m-2">
            <Button
                severity="success"
                rounded
                aria-label="Answer"
                :class="{ invisible: isAccepted }"
                @click="answerCall"
            >
                <i class="pi pi-phone"></i>
            </Button>
        </div>

        <div class="flex align-items-center justify-content-center m-2">
            <Button severity="danger" rounded aria-label="Cancel" @click="rejectCall">
                <i class="pi pi-phone" style="transform: rotate(134deg)"></i>
            </Button>
        </div>
    </div>
</template>
<style>
.invisible {
    visibility: hidden !important;
}

/* .drag {
  --webkit-app-region: 'drag';
  background-color: brown;
} */
</style>
