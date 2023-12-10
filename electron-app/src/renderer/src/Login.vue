<script setup>
const { callOnUserLogin } = window.api
</script>

<template>
  <div class="surface-card p-4 shadow-2 border-noround w-full h-full lg:w-6">
    <div class="text-center mb-5">
      <img src="./assets/logo.svg" alt="Image" height="80" class="mb-3" />
      <div class="text-900 text-3xl font-medium mb-3">Добро пожаловать!</div>
      <span class="text-600 font-medium line-height-2">Войдите используя аккаунт Fregat</span>
    </div>

    <div class="h-auto">
      <label for="email1" class="block text-900 font-medium mb-2">Логин</label>
      <InputText id="email1" type="text" class="w-full mb-3" />

      <label for="password1" class="block text-900 font-medium mb-2">Пароль</label>
      <InputText id="password1" type="password" class="w-full mb-3" />

      <div class="flex align-items-center justify-content-between mb-6">
        <div class="flex align-items-center">
          <Checkbox id="rememberme1" v-model="checked" :binary="true" class="mr-2"></Checkbox>
          <label for="rememberme1">Запомнить пароль</label>
        </div>
      </div>

      <Button
        label="Авторизоваться"
        icon="pi pi-user"
        class="w-full"
        @click="(e) => callOnUserLogin()"
      ></Button>
    </div>
  </div>
</template>
