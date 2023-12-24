<script setup>
import { ref } from 'vue'
import { UserStatusGroup } from '../classes'
import SvgIcon from '@jamescoyle/vue-icon'
import { stringToColor, stringToInitials, getColorRelativeLuminance } from '../utils'

const props = defineProps({ name: String, statusId: Number })

const bgColor = ref(stringToColor(props.name))
const luminance = ref(getColorRelativeLuminance(bgColor.value))
const initials = ref(stringToInitials(props.name))
const textColor = () => (luminance.value > 0xaa ? '#333' : '#fff')
const style = {
    'background-color': bgColor.value,
    color: textColor()
}
</script>

<template>
    <Avatar :label="initials" class="mr-2" :style="style">
        <template #default>
            <div
                style="width: 100%; height: 100%; position: relative"
                class="flex align-items-center w-full justify-content-center"
            >
                <p class="">
                    {{ initials }}
                </p>

                <svg-icon
                    class="pi pi-circle-fill border-circle text-xs custom-badge text-gray-800 pad-1"
                    type="mdi"
                    :path="UserStatusGroup.getStatusIcon(props.statusId)"
                    :size="20"
                    :class="{
                        'bg-green-500': UserStatusGroup.isOnline(props.statusId),
                        'bg-orange-400': UserStatusGroup.isWork(props.statusId),
                        'bg-yellow-400': UserStatusGroup.isLanchBreak(props.statusId),
                        'bg-gray-400': UserStatusGroup.isOffline(props.statusId)
                    }"
                ></svg-icon>
            </div>
        </template>
    </Avatar>
</template>
<style scoped>
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
