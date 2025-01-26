<script setup lang="ts">

import DropdownLogin from "~/components/shared/navs/DropdownLogin.vue";

const props = defineProps<{
  isLoading: boolean
}>()



const emit = defineEmits(['updateAll', 'saveBook'])
</script>

<template>
  <nav class="bg-black text-black head" >
    <div class="w-full flex py-3.5 justify-between" >
      <div class="my-auto ">
        <h1 class="text-white">RedditPub</h1>
      </div>
      <div class="my-auto flex ">
        <div class=" border-white flex" >
          <u-button variant="ghost"
                    class="m-auto text-center"
                    :disabled="isLoading"
                    :loading="isLoading"
                    sj
                    :ui="{
                               rounded:'rounded-none'
                             }" @click="emit('updateAll')">Save
          </u-button>
          <u-button variant="ghost"
                    class="m-auto text-center"
                    :disabled="isLoading"
                    :loading="isLoading"
                    :ui="{
                               rounded:'rounded-none'
                             }" @click="emit('saveBook')">Download
          </u-button>
        </div>
        <div class="px-4">
          <dropdown-login></dropdown-login>
        </div>
      </div>
    </div>
  </nav>

</template>

<style scoped>

</style>
