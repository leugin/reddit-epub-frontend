<script setup lang="ts">
import {object, string} from "yup";
import {AuthStore} from "~/store/AuthStore";

const loading = ref(false)
const authStore = AuthStore()
const form = reactive({
  email: '',
  password: '',
})

const schema = object({
  email: string().required('Please fill the email').email(),
  password:string().required('Please fill the password')
})
const emit = defineEmits(['loginSuccess'])

const sendForm = () => {
  loading.value = true
  authStore.login({
    email: form.email,
    password: form.password
  }).then((res) => {
    loading.value = false
    emit('loginSuccess')
  }).catch((err) => {
    loading.value = false
  })
}
</script>

<template>
  <UForm :state="form"  @submit="sendForm"  :schema="schema">

  <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <template #header>
      Login In
     </template>
    <div class="flex flex-col  mt-y">

      <div class="flex-1 ">
        <u-form-group label="Email" name="email" class="mb-9"  >
          <UInput v-model="form.email" :loading="loading" :disabled="loading"></UInput>
        </u-form-group>
        <u-form-group label="Password" name="password" class="mb-9" >
          <UInput v-model="form.password" :loading="loading" :disabled="loading" type="password"></UInput>
        </u-form-group>
      </div>
    </div>
    <template #footer>
      <div class="flex">
        <UButton type="submit" class="mx-auto px-10 my-auto " :loading="loading" :disabled="loading" >
          <span class="text-white">Send</span>
        </UButton>
      </div>

    </template>
  </UCard>

  </UForm>

</template>

<style scoped>

</style>
