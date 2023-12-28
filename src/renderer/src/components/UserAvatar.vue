<script setup>
import { ref } from 'vue'
import { UserStatusGroup } from '../classes/UserStatusGroup'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiArrowUpBold, mdiArrowDownBold } from '@mdi/js'
import { stringToColor, stringToInitials, getColorRelativeLuminance } from '../utils'

const props = defineProps({
    /** Имя пользователя */
    name: String,

    /** Идентификатор статуса */
    statusId: [Number, String],

    /** Размер аватара */
    size: String
})

/** Фоновый цвет */
const bgColor = () => stringToColor(props.name)

/** Относительная яркость фона */
const luminance = () => getColorRelativeLuminance(bgColor())

/** Инициалы */
const initials = () => stringToInitials(props.name)

/** Цвет текста */
const textColor = () => (luminance() > 0xaa ? '#333' : '#fff')

/** Параметры всплывающей подсказки */
const tooltipParams = () => {
    return {
        value: UserStatusGroup.getStatusDescription(props.statusId),
        pt: { text: 'text-sm p-1' }
    }
}

/** Иконка стрелки */
const arrowIcon = () =>
    props.statusId === UserStatusGroup.Status.PostCallWorkOutgoing
        ? mdiArrowUpBold
        : mdiArrowDownBold

/** Указывает, что статус относится к обработке */
const isPostWorking = ref(
    props.statusId == UserStatusGroup.Status.PostCallWorkIncoming ||
        props.statusId == UserStatusGroup.Status.PostCallWorkOutgoing
)
</script>

<template>
    <Avatar
        :size="props.size || 'normal'"
        :style="{ 'background-color': bgColor(), color: textColor() }"
    >
        <template #default>
            <div class="relative w-full h-full flex align-items-center justify-content-center">
                <p class="">{{ initials() }}</p>

                <div
                    v-if="props.statusId != 'none'"
                    v-tooltip.left="tooltipParams()"
                    class="custom-badge"
                >
                    <svg-icon
                        class="pi pi-circle-fill text-xs custom-badge text-gray-800 p-1px"
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
                    <svg-icon
                        v-if="isPostWorking"
                        class="arrow"
                        type="mdi"
                        :path="arrowIcon()"
                        :size="10"
                    ></svg-icon>
                </div>
            </div>
        </template>
    </Avatar>
</template>

<style scoped>
.arrow {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(-90%, 60%);
    background-color: #fff;
    border-radius: 50%;
    color: #333;
}
.custom-badge {
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 2px solid var(--surface-a);
    transform: translate(40%, 40%);
}
.p-1px {
    padding: 1px;
}
</style>
