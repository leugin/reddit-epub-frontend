<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
    <UModals />
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import {AuthStore} from "~/store/auth.store";
nextTick(() => {
  const authStore = AuthStore()
  authStore.checkIsLogin()
})

</script>
