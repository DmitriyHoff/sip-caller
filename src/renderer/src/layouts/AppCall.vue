<script setup>
import { ref } from 'vue'
import ring from '../assets/sounds/ring-default.mp3'
import call from '../assets/sounds/call.mp3'

const callerName = ref('')
const callerURI = ref('')
const type = ref()
const isAccepted = ref(false)

const callSound = new Audio(call)
callSound.loop = true
callSound.play()

// ответ на звонок
function answerCall() {
    isAccepted.value = true
    callSound.pause()
    window.api.sendPhoneAcceptClick()
}

// ответ на звонок
function rejectCall() {
    isAccepted.value = false
    callSound.pause()
    window.api.sendPhoneCancellClick()
}

// window.api.onSipInvite((params) => {
//     const { from, uri } = params
//     callerName.value = from
//     callerURI.value = uri
//     console.log({ params })
// })
</script>

<template>
    <div
        class="flex flex-row flex-nowrap align-items-stretch justify-content-between surface-500 w-full h-full p-1"
    >
        <div class="flex align-items-center justify-content-center m-2">
            <Avatar label="IT" size="large" />
        </div>

        <div class="flex align-items-center justify-content-center m-2">
            <p class="font-light text-white">{{ callerName }}</p>
            <p class="font-light text-white">{{ callerURI }}</p>
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
