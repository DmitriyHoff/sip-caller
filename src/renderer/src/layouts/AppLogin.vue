<script setup>
import { ref } from 'vue'

const login = ref(null)
const password = ref(null)
const checked = ref(null)

const loading = ref(false)
function onClick(e) {
    loading.value = !loading.value
    window.api.sendLogin({ login: login.value, password: password.value })
}
</script>

<template>
    <div class="surface-card p-4 shadow-2 border-noround w-full h-full lg:w-6">
        <div class="text-center mb-5">
            <img src="../assets/logo.svg" alt="Image" height="80" class="mb-3" />
            <div class="text-900 text-3xl font-medium mb-3">Добро пожаловать!</div>
            <span class="text-600 font-medium line-height-2">Войдите используя аккаунт Fregat</span>
        </div>

        <div class="h-auto">
            <label for="login1" class="block text-900 font-medium mb-2">Логин</label>
            <InputText id="login1" v-model="login" type="text" class="w-full mb-3" />

            <label for="password1" class="block text-900 font-medium mb-2">Пароль</label>
            <InputText id="password1" v-model="password" type="password" class="w-full mb-3" />

            <div class="flex align-items-center justify-content-between mb-6">
                <div class="flex align-items-center">
                    <Checkbox
                        id="rememberme1"
                        v-model="checked"
                        :binary="true"
                        class="mr-2"
                    ></Checkbox>
                    <label for="rememberme1">Запомнить пароль</label>
                </div>
            </div>
            <Button
                class="flex w-full align-items-center justify-content-center gap-3 text-lg"
                plain
                text
                raised
                @click="(e) => onClick(e)"
            >
                <div class="w-2rem h-2rem">
                    <ProgressSpinner
                        v-show="loading"
                        class="m-0 mr-3 w-full h-full"
                        stroke-width="4"
                        aria-label="Loading"
                    />
                </div>

                <span class="mr-6">Авторизоваться</span>
            </Button>
        </div>
    </div>
</template>
