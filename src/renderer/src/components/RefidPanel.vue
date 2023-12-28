<script setup>
import { ref } from 'vue'
import { useSipStore } from '../stores/sipStore'
const store = useSipStore()

const refidNumber = ref(null)
const phoneNumber = ref(null)
const comment = ref(null)
const confid = ref(false)

const splitButtonItems = [
    {
        label: 'Линия 1',
        icon: 'pi pi-phone',
        command: () => {
            console.log('splitBtn1')
        }
    },
    {
        label: 'Линия 2',
        icon: 'pi pi-phone',
        command: () => {
            console.log('splitBtn2')
        }
    }
]

function call() {
    store.call(phoneNumber.value)
}
</script>
<template>
    <div class="surface-card shadow-2 p-3 pt-6 border-round w-full h-full overflow-y-auto">
        <div class="flex flex-column gap-5 text-sm w-full h-full">
            <div class="flex align-items-center justify-content-between gap-3">
                <span class="flex-grow-1 p-float-label">
                    <InputText
                    v-tooltip="'UserStatusGroup.getStatusDescription(props.statusId)'"
                        id="refidNumber"
                        v-model="refidNumber"
                        type="text"
                        size="small"
                        class="w-full"
                    />
                    <label for="refidNumber">Номер дела</label>
                </span>
                <Button
                    v-tooltip="'UserStatusGroup.getStatusDescription(props.statusId)'"
                    label="Найти"
                    class="font-normal"
                    size="small"
                    icon="pi pi-search"
                    severity="info"
                />
            </div>
            <div class="flex align-items-center justify-content-between gap-3">
                <span class="flex-grow-1 p-float-label">
                    <InputText
                        id="phoneNumber"
                        v-model="phoneNumber"
                        type="text"
                        size="small"
                        class="w-full"
                    />
                    <label for="phoneNumber">Номер телефона</label>
                </span>
                <SplitButton
                    label="Позвонить"
                    class="font-normal"
                    :model="splitButtonItems"
                    size="small"
                    icon="pi pi-phone"
                    severity="success"
                    @click="call"
                />
            </div>

            <div class="flex w-full">
                <span class="p-float-label w-full">
                    <Textarea v-model="comment" rows="5" cols="10" class="w-full" />
                    <label>Комментарий</label>
                </span>
            </div>

            <div class="flex w-full flex-nowrap align-items-center justify-content-between">
                <div class="flex align-items-center gap-2">
                    <Checkbox id="confid" v-model="confid" :binary="true"></Checkbox>
                    <label for="rememberme1">Конфиденциально</label>
                </div>

                <Button label="Сохранить" icon="pi pi-check" class="flex"></Button>
            </div>
        </div>
    </div>
</template>
