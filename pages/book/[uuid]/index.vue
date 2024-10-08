<script setup lang="ts">
import {BookStore} from "~/store/BookStore";
import {onMounted} from "vue";
import SimpleModal from "~/components/shared/ConfirmModal.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import RichEditor from "~/components/shared/RichEditor.vue";
import type {RedditPage} from "~/types/RedditBook";
import { Sortable } from "sortablejs-vue3";
import type { SortableOptions } from "sortablejs";

const bookStore = BookStore()
const route = useRoute();
const modal = useModal()
const selectedItem = ref<any>(null)
const editor = ref<typeof RichEditor| null>(null)
const mode = ref<'default'|'editor'|'cover'>('default')
let pages = ref<any[]>([]);
const htmlContent = ref('')
onMounted(async ()=> {
  if ( typeof route.params.uuid === 'string') {
    const response = await bookStore.show(route.params.uuid);
    pages.value = response.data.pages.map((item, index ) => {
      return   {
        id:index,
       ...item
      };
    })
  }

})

const user = computed(()=> {
  return null
})
const formIsPristine = computed(()=> editor?.value?.isPristine)
const moveItemInArray = async (array: any[], from: number, to: number) => {
  const item = array.splice(from, 1)[0];
  array.splice(to, 0, item)

};

const onEnd = (event: any) => {
  if (bookStore.book?.pages){
    moveItemInArray(pages.value, event.oldIndex, event.newIndex)

  }
}
const updatePage = (newPage: any, id:number) => {
  const  index = pages.value.findIndex(value => value?.id === id);
  if(index != -1){
    pages.value[index].html = newPage.html
  }
}

const deletePage = (id: number) => {
  const index = pages.value.findIndex(val => val.id === id)
  if (index != -1) {
    const nextIndex = index == 0 ? 1:  index - 1
    const nextPage = pages.value[nextIndex];
    selectPage(nextPage);
    pages.value.splice(index, 1)
  }

}
 const selectPage = ( page: {id:number, title:string,sub_title:string, html:string} )=> {
  if (selectedItem.value && !formIsPristine){
    confirmModal(page).then((isYes) => {
      if (isYes) {
        if (bookStore.book){
          const cp:RedditPage = {
            ...selectedItem.value,
            html: editor?.value?.getHtml()
          }
          updatePage(cp, selectedItem.value.id )
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

const confirmModal = () => {
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

const download = async () => {
  if(typeof route.params.uuid ==='string' && bookStore.book ) {
    bookStore.book.pages = pages.value.map((item) => {
      return {
        title: item.title,
        sub_title: item.sub_title,
        created: item.created,
        html: item.html,
      }
    })
    const response = await bookStore.store(route.params.uuid)
    const link = document.createElement('a')
    link.setAttribute('href', response.data.url)
    link.setAttribute('download','true')
    link.click()
  }
}
const save = () => {
  const cp:any = {
    ...selectedItem.value,
    html: editor?.value?.getHtml()
  }
  updatePage(cp, selectedItem.value.id)
 }
const del = () => {
 deletePage(selectedItem.value.id)


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

const options = computed<SortableOptions>(() => {
  return {
    draggable: ".draggable",
    animation: 150,
    ghostClass: "ghost",
    dragClass: "drag",
    group: "testgroup",
    scroll: true,
    forceFallback: true,
    bubbleScroll: true,
  };
});


</script>

<template>
  <div>
    <nav class="bg-black text-black head flex px-3 justify-between" >
         <div class="my-auto ">
           <h1 class="text-white">RedditPub</h1>

        </div>
        <div class="my-auto flex ">
          <div class="px-6  border-white	mr-5" :class="{'border-r-2': !!user?.id}">
            <u-button variant="ghost"
                      class="m-auto w-full text-center"
                      :ui="{
                               rounded:'rounded-none'
                             }" @click="download">Download
            </u-button>
          </div>
         <div>
           <UDropdown v-model:open="open" :items="items" :popper="{ placement: 'bottom-start' }" v-if="!!user?.id">
            <UButton color="white" label="" trailing-icon="i-heroicons-chevron-down-20-solid" />
          </UDropdown>
         </div>
        </div>
    </nav>

    <div class="flex h-full " id="body" style="width: 100vw;height: calc(100vh - 100px)">

      <div class=" flex w-48	flex-col panel" >
        <div class="book-navigation overflow-x-hidden overflow-y-auto flex flex-col flex-1" style="max-height: 100vh">


          <Sortable
              :list="pages"
              item-key="id"
              tag="div"
              @end="onEnd"
              :options="options"
          >
            <-- The Header and Footer templates below are optional -->
            <template #header>
              <header>
                <u-button :variant="mode == 'cover' ? 'solid':'ghost'"
                          class="flex-1 m-auto w-full"
                          :ui="{
                     rounded:'rounded-none'
                   }" @click="mode = 'cover'"> Cover </u-button>
              </header>
            </template>
            <template #item="{element}">
              <div class="draggable flex" :key="element.id">
                <UButton
                    :variant="'ghost'"
                    :color="'red'"
                    @click="deletePage(element.id)"
                    :ui="{
                                       rounded:'rounded-none'
                                     }">
                  X
                </UButton>
                <UButton
                    :key="element.id" @click="selectPage(element)"
                    :variant="element.id == selectedItem?.id ? 'solid':'ghost'"
                    class="flex-1 list-button w-full"
                    :ui="{
                                       rounded:'rounded-none'
                                     }"

                >
                  {{element.title}}
                </UButton>
              </div>
            </template>
          </Sortable>

        </div>

      </div>
      <div class=" flex flex-1 bg-white flex-col overflow-y-auto " style="max-height: 100vh">
        <div class="w-full text-sm text-black main" v-show="mode === 'editor'">
          <div class="w-full flex   py-4 ">
            <div class="flex flex-col flex-1">
              <h1 class="m-auto font-bold">{{bookStore.book?.name  ? bookStore.book?.name:  '-'}}&nbsp;</h1>
              <h2 class="m-auto">{{bookStore.book?.author  ? bookStore.book?.author: '-'}}&nbsp;</h2>
              <h2 class="m-auto">{{selectedItem?.title ? selectedItem?.title : '-'}}</h2>
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

.list-button{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.main{
  height: calc(100vh - 92px);
  max-height: calc(100vh - 92px)
}

.panel{
  border: 2px solid transparent;
  padding: 4px;
  width: 150px;
  resize: horizontal;
  overflow: auto;
  max-width: 50vw;
}
</style>
