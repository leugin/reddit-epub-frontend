<script setup lang="ts">

const modal = useModal()

const props = defineProps({
  title:{
    type: String,
    required: false,
  },
  text:{
    type: String,
    required: true,
  },
})

const emit = defineEmits(['yes', 'no', 'close'])

const xClose = ()=> {
  modal.close()
  emit('close')
}

const noClose = ()=> {
  modal.close()
  emit('no')
}

</script>

<template>
  <UModal >
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex">
          <div class="flex-1">{{props.title ?? 'Question'}}</div>
          <div class="flex-none">
            <u-button icon="i-heroicons-x-mark-20-solid" size="sm" @click="xClose()"></u-button>
          </div>
        </div>
      </template>

      {{props.text}}
      <template #footer>
        <div class="flex justify-between">
          <div>
            <u-button @click="noClose()" variant="outline"  > No </u-button>

          </div>
          <div >
            <u-button @click="emit('yes')"> Yes </u-button>
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped>

</style>
