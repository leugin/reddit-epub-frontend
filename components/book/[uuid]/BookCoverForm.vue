<script setup lang="ts">
import {object, string} from "yup";


const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {
      title:'',
      cover:'',
      description:''
    }
  },
  isLoading:{
    type: Boolean,
    required: false,
    default: false
  }
})
const coverForm = reactive({
  description: '',
  title: '',
  cover: '',
})
const schema = object({
  description: string(),
  title: string().required(),
  cover:string()
})

onMounted(()=>{
  coverForm.description = props.data.description
  coverForm.title = props.data.title
  coverForm.cover = props.data.cover
})
const emit =  defineEmits(['save'])
</script>

<template>
  <u-container class="m-auto ">
    <UForm :state="coverForm"  @submit="emit('save', coverForm)"  :schema="schema">

      <div class="flex flex-col  mt-y">

        <div class="flex-1 min-h-80">
          <u-form-group label="Title" name="cover" class="mb-9" >
            <UInput v-model="coverForm.title" :loading="isLoading" :disabled="isLoading"></UInput>
          </u-form-group>
          <u-form-group label="Image URL" name="cover" class="mb-9" >
            <UInput v-model="coverForm.cover" :loading="isLoading" :disabled="isLoading"></UInput>
          </u-form-group>

          <u-form-group label="Description" name="description" class="mb-9"  >
            <UTextarea v-model="coverForm.description" :loading="isLoading" :disabled="isLoading"></UTextarea>
          </u-form-group>
        </div>
        <div class="flex-none flex">
          <UButton type="submit" class="mx-auto px-14 " :loading="isLoading" :disabled="isLoading" >
            <span class="text-white">Save</span>
          </UButton>
        </div>

      </div>
    </UForm>

  </u-container>

</template>

<style scoped>

</style>
