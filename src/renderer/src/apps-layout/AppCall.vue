<script setup>
import { ref } from 'vue'
import ring from '../assets/sounds/ring-default.mp3'
import call from '../assets/sounds/call.mp3'
import { SessionState } from 'sip.js'
import UserAvatar from '../components/UserAvatar.vue'
import { formatDate } from '../utils'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiPhone, mdiPhoneHangup } from '@mdi/js'
const callerName = ref('')
const callerURI = ref('')
const beginAt = ref(null)
const duration = ref(null)
const isAccepted = ref(false)
const incoming = ref(false)
let intervalId

const sound = new Audio()
sound.loop = true

// ответ на звонок
function answerCall() {
    isAccepted.value = true
    sound.pause()
    window.api.sendPhoneAcceptClick()
}

// ответ на звонок
function rejectCall() {
    isAccepted.value = false
    sound.pause()
    window.api.sendPhoneCancellClick()
}

function startTimer() {
    console.log('Timer starts...')
    beginAt.value = new Date()
    intervalId = setInterval(() => {
        duration.value = formatDate(new Date() - beginAt.value)
    })
}

window.api.onSipInvite((params) => {
    const { from, uri } = params
    incoming.value = true
    isAccepted.value = false

    callerName.value = from
    callerURI.value = uri

    beginAt.value = null
    duration.value = null

    sound.src = ring
    sound.play()
})

window.api.onSipSessionStateChanged((params) => {
    const { direction, userName, userId, state } = params
    callerName.value = userName
    callerURI.value = userId

    console.log({ params })
    switch (state) {
        case SessionState.Establishing:
            sound.src = call
            sound.play()
            break

        case SessionState.Established:
            startTimer()
            isAccepted.value = true
            sound.src = null
            break

        case SessionState.Terminated:
            clearInterval(intervalId)
            beginAt.value = null
            duration.value = null
            sound.src = null
    }
})
</script>

<template>
    <div class="w-full h-full p-2 surface-500">
        <div class="flex flex-row gap-2 flex-nowrap align-items-stretch w-full h-full">
            <div class="flex align-items-center justify-content-center">
                <UserAvatar :name="callerName || callerURI" status-id="none" size="large" />
            </div>

            <div class="flex flex-column gap-2 justify-content-center">
                <p class="font-light text-white m-0">{{ callerName }}</p>
                <p class="font-light text-white m-0">{{ callerURI }}</p>
            </div>
            <p class="flex flex-column gap-2 justify-content-center ml-auto font-light text-white">
                {{ duration }}
            </p>
            <div class="flex gap-2 align-items-center justify-content-center">
                <Button
                    severity="success"
                    rounded
                    aria-label="Answer"
                    :class="{ invisible: isAccepted }"
                    @click="answerCall"
                >
                    <svg-icon type="mdi" :path="mdiPhone" :size="24"></svg-icon>
                </Button>
                <Button severity="danger" rounded aria-label="Cancel" @click="rejectCall">
                    <svg-icon type="mdi" :path="mdiPhoneHangup" :size="24"></svg-icon>
                </Button>
            </div>
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
