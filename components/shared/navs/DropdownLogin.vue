<script setup lang="ts">

import type {DropdownItem} from "#ui/types";
import {AuthStore} from "~/store/auth.store";
import SingingForm from "~/components/auth/SiginForm.vue";
import LoginForm from "~/components/auth/LoginForm.vue";

const emit = defineEmits(['loginSuccess','singInSuccess'])
const useAuthStore = AuthStore()
const openLogIn = ref(false)
const openSingIn = ref(false)

const unAuthenticateItems:DropdownItem[][] = [
  [{
    label: 'Login In',
    icon:'heroicons:arrow-right-end-on-rectangle-16-solid',
    click: () =>{openLogIn.value = true}
  },{
    label: 'Sign In',
    icon:'heroicons:user-plus',
    click: () =>{openSingIn.value = true}

  }]
];

const authItems:DropdownItem[][] = [
  [{
    label: 'Logout',
    icon:'heroicons:arrow-right-end-on-rectangle-16-solid',
    click: () =>{useAuthStore.logOut()}
  }]
];
const items =  computed(()=> useAuthStore.isAuth ? authItems : unAuthenticateItems)

const loginText =  computed(()=> useAuthStore.isAuth ? 'Log Out' : 'Log In')

</script>

<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
    <UButton color="white" :label="loginText" icon="i-heroicons-user-circle"  />
  </UDropdown>
  <UModal v-model="openLogIn" >
    <div class="p-4">
      <LoginForm @login-success="openLogIn = false; emit('loginSuccess')"> </LoginForm>
    </div>
  </UModal>
  <UModal v-model="openSingIn" >
    <div class="p-4">
      <SingingForm @login-success="openSingIn = false; emit('singInSuccess')"> </SingingForm>
    </div>
  </UModal>
</template>

<style scoped>

</style>
