<script setup lang="ts">

import RichEditor from "~/components/shared/RichEditor.vue";
import {object, string} from "yup";
import {BookStore} from "~/store/book.store";

const emit = defineEmits(['save'])
const editor = ref<typeof RichEditor| null>(null)

const props = defineProps({
  isLoading:{
    type: Boolean,
    required:false,
    default: false
  },
  selectedItem:{
    type: Object,
    required:false,
    default: null
  }
});

const pageHeadForm = reactive({
  title: ''
})
const pageHeadSchema = object({
  title: string().required()
})

const htmlContent = ref('')

const useBookStore = BookStore()
watch(() => props.selectedItem, (newVal) => {
  if (newVal) {
    pageHeadForm.title = newVal.title
    htmlContent.value = newVal.content
    editor?.value?.setPristine(true)
    editor?.value?.setHtml(newVal.content)
  }
}, { immediate: true, deep: true });

const html = () => {
  return editor?.value?.getHtml()
}
const isPristine = () => {
  return editor?.value?.isPristine
}
const setPristine = (value:boolean) => {
  editor?.value?.setPristine(value)
}
const emitSave = () => {
  emit('save', {
    title: pageHeadForm.title,
    content: html()
  })
}
const formData  = () => {
  return {
    title: pageHeadForm.title,
    content: html()
  }
}
defineExpose({html, isPristine, setPristine, formData})
</script>

<template>
  <UForm :state="pageHeadForm" @submit="emitSave" :schema="pageHeadSchema">
    <div class=" flex   py-4 ">
      <div class="flex flex-col flex-1 px-4">
        <h2 class="">{{useBookStore.book?.author  ? useBookStore.book?.author: '-'}}&nbsp;</h2>
        <u-form-group  name="title" class="mb-9 bg-white" >
          <UInput
              v-model="pageHeadForm.title" :loading="isLoading" :disabled="isLoading"
              color="orange"
              input-class="text-color-black-important"
          ></UInput>
        </u-form-group>
      </div>

    </div>
  </UForm>
  <div class="overflow-y-auto" style="">
    <RichEditor ref="editor" v-model="htmlContent" :title="selectedItem?.title"></RichEditor>
  </div>
</template>

<style scoped>

</style>
