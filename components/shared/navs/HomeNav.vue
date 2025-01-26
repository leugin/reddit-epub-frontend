<script setup lang="ts">
import {AuthStore} from "~/store/auth.store";
import type {DropdownItem} from "#ui/types";
import SingingForm from "~/components/auth/SiginForm.vue";
import LoginForm from "~/components/auth/LoginForm.vue";

const useAuthStore = AuthStore()

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
const openLogIn = ref(false)
const openSingIn = ref(false)
const emit = defineEmits(['loginSuccess','singInSuccess'])

</script>

<template>
  <div>
    <div class="login ">
      <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
        <UButton color="white" :label="loginText" icon="i-heroicons-user-circle"  />
      </UDropdown>
    </div>
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
  </div>

</template>

<style scoped>
.login{
  position: fixed;
  top: 40px;
  right: 40px;
  z-index: 3;
}
</style>
