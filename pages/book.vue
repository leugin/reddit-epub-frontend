<script setup lang="ts">
import {BookStore} from "~/store/BookStore";
import {onMounted} from "vue";
import SimpleModal from "~/components/shared/ConfirmModal.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import RichEditor from "~/components/shared/RichEditor.vue";
import type {RedditPage} from "~/types/RedditBook";


const bookStore = BookStore()
const modal = useModal()
const selectedItem = ref<any>(null)
const editor = ref<typeof RichEditor| null>(null)
const showMenu = ref(false)
const mode = ref<'default'|'editor'|'cover'>('default')
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

const formIsPristine = computed(()=> editor?.value?.isPristine)

const selectPage = ( page: {id:number, label:string, html:string} )=> {

  if (selectedItem.value && !formIsPristine){
    confirmModal(page).then((isYes) => {
      if (isYes) {
        if (bookStore.book){
          const cp:RedditPage = {
            ...selectedItem.value,
            html: editor?.value?.getHtml()
          }
          bookStore.updatePage(cp, selectedItem.value.id)
        }
      }
      selectedItem.value = { ...page }
      editor.value.setPristine(true)
      editor?.value?.setHtml(page.html)
      htmlContent.value = page.html
      mode.value = 'editor';

    })
  } else  {
    editor.value.setPristine(true)
    editor?.value?.setHtml(page.html)
    selectedItem.value = {...page}
    mode.value = 'editor';
  }

}


const confirmModal = (page : any) => {
  return new Promise((resolve, reject)=> {
    modal.open(SimpleModal, {
      text: "Save changes?",
      onYes:()=> {
        resolve(true)
        modal.close()
      },
      onNo:()=> {
        resolve(false)
        modal.close()
      },
      onClose: reject

    })
  })

}

const download = () => {
  console.log(htmlContent.value)
}
const save = () => {
  const cp:RedditPage = {
    ...selectedItem.value,
    html: editor?.value?.getHtml()
  }
  bookStore.updatePage(cp, selectedItem.value.id)
}
const del = () => {
  mode.value = 'cover'
  bookStore.deletePage(selectedItem.value.id)
  selectedItem.value = null


}
const open = ref(true)
const items = [
  [{
    label: 'Logout',
    click: ()=> {
      console.log('click')
    },
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    }
  }]
]
</script>

<template>
  <div>
    <div class="flex" id="body">

      <div class=" flex w-48	flex-col" >
        <div class=" head flex" >
          <u-button :variant="showMenu ? 'solid':'ghost'"
                    class="m-auto w-full text-center"
                    :ui="{
                               rounded:'rounded-none'
                             }" @click="showMenu = !showMenu">Menu
          </u-button>

        </div>
        <div class="book-navigation overflow-x-hidden overflow-y-auto flex flex-col flex-1" style="max-height: calc(100vh - 42px)">

          <u-button :variant="-1 == selectedItem?.id ? 'solid':'ghost'"
                    class="flex-1 m-auto w-full"
                    :ui="{
                     rounded:'rounded-none'
                   }" @click="mode = 'cover'">Cover </u-button>
          <UTooltip v-for="item in links" :text="item.label">


            <UButton
                :key="item.id" @click="selectPage(item)"
                :variant="item.id == selectedItem?.id ? 'solid':'ghost'"
                class="flex-1 list-button"
                :ui="{
                     rounded:'rounded-none'
                   }"

            >
              {{item.label}}
            </UButton>
          </UTooltip>
        </div>

      </div>
      <div class=" flex flex-1 bg-white flex-col">
        <nav class="bg-black text-black head fixed flex px-3 justify-between" :class="{show: showMenu}">

          <div class="my-auto ">
            <u-button variant="ghost"
                      class="m-auto w-full text-center"
                      :ui="{
                               rounded:'rounded-none'
                             }" @click="download">Download
            </u-button>
          </div>
          <div class="my-auto ">
            <UDropdown v-model:open="open" :items="items" :popper="{ placement: 'bottom-start' }">
              <UButton color="white" label="" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
          </div>

        </nav>
        <div class="w-full text-sm text-black main" v-show="mode === 'editor'">
          <div class="w-full flex   py-4 ">
            <div class="flex flex-col flex-1">
              <h1 class="m-auto font-bold">{{bookStore.book?.name  ? bookStore.book?.name:  '-'}}&nbsp;</h1>
              <h2 class="m-auto">{{bookStore.book?.author  ? bookStore.book?.author: '-'}}&nbsp;</h2>
              <h2 class="m-auto">{{selectedItem?.label ? selectedItem?.label : '-'}}</h2>
            </div>
            <div class="px-4 w-48">
              <u-button variant="ghost"
                        class="m-auto w-full text-center"
                        :ui="{
                               rounded:'rounded-none'
                             }" @click="del">Eliminar
              </u-button>
              <u-button variant="ghost"
                        class="m-auto w-full text-center"
                        :disabled="formIsPristine"
                        :ui="{
                               rounded:'rounded-none'
                             }" @click="save">Save
              </u-button>

            </div>

          </div>
          <div class="overflow-y-auto" style="">
            <RichEditor ref="editor" v-model="htmlContent" :title="selectedItem?.title"></RichEditor>
          </div>
        </div>
        <div class="w-full text-sm text-black main" v-show="mode === 'cover'">
          <h1>Cover</h1>
        </div>
        <div class="w-full text-sm text-black main flex" v-show="mode === 'default'">
          <div class="m-auto">
            <h1 class="font-bold"> Welcome here you can personalized your book  </h1>
            <h3> In the right you can choose the character to edit or you can personalized the Cover</h3>
            <h3> after you finished click on 'Menu' and download</h3>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<style scoped>
.head{
  height: 52px;
}
nav.head.show {
  left: 192px;
}
nav.head{
  width: calc(100vw - 192px);
  left: 100%;
  transition: all 600ms;
  z-index: 3;
}
.list-button{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.main{
  height: calc(100vh - 92px);
  max-height: calc(100vh - 92px)
}

</style>
