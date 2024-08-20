<script setup lang="ts">
import {BookStore} from "~/store/BookStore";
import {onMounted} from "vue";
import SimpleModal from "~/components/shared/ConfirmModal.vue";

const bookStore = BookStore()
const modal = useModal()

const selectedItem = ref<any>(null)
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
const html = computed(()=> {
  return selectedItem.value ? selectedItem.value.html : 'Select a page'
})

const selectPage = (page: {id:number, label:string, html:string} )=> {

  if (selectedItem.value){
    confirmModal(page)
  }else  {
    selectedItem.value = {...page}
  }

}
const changehtml = (e)=> {
  console.log(e)
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
        <div class="w-full text-sm text-black overflow-y-auto" style="height: calc(100vh - 52px); max-height: calc(100vh - 42px)">
          <div   v-html="html" contenteditable="true" @change="changehtml">  </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
