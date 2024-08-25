<script setup lang="ts">
import {BookStore} from "~/store/BookStore";
import {onMounted} from "vue";
import SimpleModal from "~/components/shared/ConfirmModal.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import RichEditor from "~/components/shared/RichEditor.vue";


const bookStore = BookStore()
const modal = useModal()
const selectedItem = ref<any>(null)
const editor = ref(null)
const htmlContent = ref('')
onMounted(async ()=> {
  await bookStore.findByLink('-')
})


const links = computed(()=> {
  return bookStore.book?.pages.map((item, index ) => {
    return   {
      id:index,
      label: item.title,
      html: item.html
     };
   })
})

const selectPage = (page: {id:number, label:string, html:string} )=> {
  htmlContent.value = page.html
  console.log(editor.value)
  editor?.value?.setHtml(page.html)
 // quill?.clipboard.dangerouslyPasteHTML(0, page.html);
  if (selectedItem.value){
    confirmModal(page)
  }else  {
    selectedItem.value = {...page}
  }

}
const confirmModal = (page : any) => {
  modal.open(SimpleModal, {
    text: "Save changes?",
    onYes:()=> {
      selectedItem.value = {...page}
      modal.close()
    },
    onNo:()=> {
      selectedItem.value = {...page}
      modal.close()
    }

  })
}

const save = () => {
  console.log(htmlContent.value)
}

</script>

<template>
  <div>
   <div class="flex" id="head">
     <div class="w-48	">
       <div class="px-3 pt-2.5">
         <u-button>Portada </u-button>
       </div>
     </div>
     <div class=" flex flex-1">
       <div class="w-full text-sm">
         <p ><span class="font-semibold">Title: </span><span>{{bookStore.book?.name}}</span></p>
         <p ><span class="font-semibold">Author: </span><span>{{bookStore.book?.author}}</span></p>
       </div>
     </div>
     <div class="w-48	">
       <div class="px-3 pt-2.5">
         <u-button>Login</u-button>
       </div>
     </div>

   </div>
    <div class="flex" id="body">

      <div class="w-48	">
        <div class="book-navigation overflow-x-hidden overflow-y-auto flex flex-col" style="max-height: calc(100vh - 42px)">
          <UButton v-for="item in links"
                   :key="item.id" @click="selectPage(item)"
                   :variant="item.id == selectedItem?.id ? 'solid':'ghost'"
                   class="flex-1"
                   :ui="{
                     rounded:'rounded-none'
                   }"

          >
            {{item.label}}
          </UButton>

        </div>
      </div>
      <div class=" flex flex-1 bg-white">
        <div class="w-full text-sm text-black " style="height: calc(100vh - 52px); max-height: calc(100vh - 42px)">
        <RichEditor ref="editor" v-model="htmlContent"></RichEditor>
          <UButton
              :ui="{ rounded: 'rounded-full' }"
              class="absolute bottom-10 right-10"
              @click="save"
          >Save</UButton>

        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
