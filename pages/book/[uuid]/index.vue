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
import {object, string} from "yup";

const bookStore = BookStore()
const route = useRoute();
const modal = useModal()
const alerts = useToast()
const selectedItem = ref<any>(null)
const queueLoading = ref(0)
const panel = ref();
const editor = ref<typeof RichEditor| null>(null)
const mode = ref<'default'|'editor'|'cover'>('default')
let content = ref<any[]>([]);
const htmlContent = ref('')

const coverForm = reactive({
  description: '',
  cover: '',
})
const mouseCoordinate = reactive({
  x: 0,
  y: 0,
})
const schema = object({
  description: string(),
  cover:string()
})

const mouseMovement = (e: MouseEvent) => {
  mouseCoordinate.x = e.clientX
  mouseCoordinate.y = e.clientY
}

const getSelectedIndex = () => {
  return content.value.findIndex(val => val.id === selectedItem.value.id)
}

const getNextIndex = () => {
  if (!selectedItem.value) {
    return content.value.length > 0 ? 0: -1
  }
  const index = getSelectedIndex()
  return index === -1 || index == content.value.length - 1 ? -1 : index + 1
}
const getLastIndex = () => {
  if (!selectedItem.value) {
    return content.value.length > 0 ? content.value.length - 1: -1
  }
  const index = getSelectedIndex()
  return index === -1 || index === 0 ? -1 : index - 1
}

const isNavigable = ()=> {
  const elementUnderCursor = document.elementFromPoint(mouseCoordinate.x, mouseCoordinate.y);
  return !document?.activeElement?.classList.contains('ql-editor')
      || elementUnderCursor?.parentElement?.classList.contains('draggable')

}
const navigationEvent = (e:KeyboardEvent) => {
  if (isNavigable()) {
    if(e.key == 'ArrowDown' || e.key == 'ArrowUp'){
      const nextIndex = e.key == 'ArrowDown'
          ?  getNextIndex()
          : getLastIndex()
      if (nextIndex != -1 ){
        const item = content.value[nextIndex];
        selectPage(item);
        const ele = document.querySelector('#btn-page-'+ item.id)
        ele?.scrollIntoView({
              behavior: 'smooth', // Animación suave
              block: 'nearest'    // Alinea el elemento lo más cercano a la vista posible
            })
      }
    }
  }

}

onMounted(async ()=> {
  if ( typeof route.params.uuid === 'string') {
    const response = await bookStore.show(route.params.uuid)
    content.value = response.data.content.map((item, index ) => {
      return   {
        id:index,
       ...item
      };
    })
    coverForm.cover = response.data.cover ?? ''
    coverForm.description = response.data.description ?? ''
  }
  window.addEventListener('keydown', navigationEvent)
  window.addEventListener('mousemove', mouseMovement)

})

onUnmounted(()=> {
  window.removeEventListener('keydown', navigationEvent)
  window.removeEventListener('mousemove', mouseMovement)
})

const user = computed(()=> {
  return null
})
const isLoading = computed(()=> queueLoading.value !== 0);

const formIsPristine = computed(()=> editor?.value?.isPristine)
const moveItemInArray = async (array: any[], from: number, to: number) => {
  const item = array.splice(from, 1)[0];
  array.splice(to, 0, item)

};

const onEnd = (event: any) => {
  if (bookStore.book?.content){
    moveItemInArray(content.value, event.oldIndex, event.newIndex)
  }
}
const updatePage = (newPage: any, id:number) => {
  const  index = content.value.findIndex(value => value?.id === id);
  if(index != -1){
    content.value[index].content = newPage.content
  }
}

const deletePage = (id: number) => {
  const index = content.value.findIndex(val => val.id === id)
  if (index != -1) {
    const nextIndex = index == 0 ? 1:  index - 1
    const nextPage = content.value[nextIndex];
    selectPage(nextPage);
    content.value.splice(index, 1)
  }
}
const selectPageById = (id: number) => {
  const index = content.value.findIndex(val => val.id === id)
  if (index != -1) {
    const nextPage = content.value[index];
    selectPage(nextPage);
  }
}
 const selectPage = ( page: {id:number, title:string,sub_title:string, content:string} )=> {
  if (selectedItem.value && !formIsPristine.value){
    confirmModal().then((isYes) => {
      if (isYes) {
        if (bookStore.book){
          const cp:RedditPage = {
            ...selectedItem.value,
            content: editor?.value?.getHtml()
          }
          updatePage(cp, selectedItem.value.id )
         }
      }
      selectedItem.value = { ...page }
      editor?.value.setPristine(true)
      editor?.value?.setHtml(page.content)
      htmlContent.value = page.content
      mode.value = 'editor';

    })
  } else  {
    editor?.value.setPristine(true)
    editor?.value?.setHtml(page.content)
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


const store = async  () => {
  if (typeof route.params.uuid ==='string' && bookStore.book ) {
    queueLoading.value = queueLoading.value + 1
    bookStore.book.content = content.value.map((item) => {
      return {
        title: item.title,
        created: item.created,
        content: item.content,
      }
    })
    bookStore.book.cover = coverForm.cover
    bookStore.book.description = coverForm.description
    const response =  await bookStore.store(route.params.uuid)
    queueLoading.value = queueLoading.value - 1
    return response

  }
  return Promise.reject('book it is not valid')
}

const updateAll = async ()=> {
  const cp:RedditPage = {
    ...selectedItem.value,
    content: editor?.value?.getHtml()
  }
  updatePage(cp, selectedItem.value.id )
  await update()
  editor?.value?.setPristine(true)

}
const update = async  () => {
  if (typeof route.params.uuid ==='string' && bookStore.book ) {
    queueLoading.value = queueLoading.value + 1
    bookStore.book.content = content.value.map((item) => {
      return {
        title: item.title,
        created: item.created,
        content: item.content,
      }
    })
    bookStore.book.cover = coverForm.cover
    bookStore.book.description = coverForm.description
    const response =  await bookStore.update(route.params.uuid)
    queueLoading.value = queueLoading.value - 1
    alerts.add({
      title:'Guardado',
      timeout:5
    })
    return response

  }
  return Promise.reject('book it is not valid')
}

const saveBook = async (download = false) => {
  const response = await store()
  if (download){
    const link = document.createElement('a')
    link.setAttribute('href', response.data.url)
    link.setAttribute('target', '_black')
    link.setAttribute('download','true')
    link.click()
  }
}
const savePage = () => {
  const cp:any = {
    ...selectedItem.value,
    content: editor?.value?.getHtml()
  }
  updatePage(cp, selectedItem.value.id)
  editor?.value.setPristine(true)

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

defineShortcuts({
  meta_s:{
    usingInput: true,
    handler: async () => {
      await updateAll()
    }
  }
})

</script>

<template>
  <div>
    <nav class="bg-black text-black head" >
      <div class="w-full flex py-3.5 justify-between" >
        <div class="my-auto ">
          <h1 class="text-white">RedditPub</h1>
        </div>
        <div class="my-auto flex ">
          <div class=" border-white flex" :class="{'border-r-2': !!user?.id}">
            <u-button variant="ghost"
                      class="m-auto text-center"
                      :disabled="isLoading"
                      :loading="isLoading"
                      sj
                      :ui="{
                               rounded:'rounded-none'
                             }" @click="updateAll">Save
            </u-button>
            <u-button variant="ghost"
                      class="m-auto text-center"
                      :disabled="isLoading"
                      :loading="isLoading"
                      :ui="{
                               rounded:'rounded-none'
                             }" @click="saveBook(true)">Download
            </u-button>
          </div>
          <div>
            <UDropdown v-model:open="open" :items="items" :popper="{ placement: 'bottom-start' }" v-if="!!user?.id">
              <UButton color="white" label="" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex h-full " id="body" style="height: calc(100vh - 100px)">

      <div id="panel" ref="panel" class=" flex w-48	flex-col panel" >
        <div class="book-navigation flex flex-col flex-1" style="max-height: 100vh">
          <Sortable
              :list="content"
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
                    :id="'btn-page-'+element.id"
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
      <div class=" flex flex-1 bg-white flex-col overflow-y-auto overflow-x-hidden " style="max-height: 100vh;">
        <div class=" text-sm text-black main" v-show="mode === 'editor'">
          <div class=" flex   py-4 ">
            <div class="flex flex-col flex-1">
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
                             }" @click="savePage">Save
              </u-button>

            </div>

          </div>
          <div class="overflow-y-auto" style="">
            <RichEditor ref="editor" v-model="htmlContent" :title="selectedItem?.title"></RichEditor>
          </div>
        </div>
        <div class=" text-sm bg-black main h-full" v-show="mode === 'cover'">
          <UContainer class="m-auto ">
            <UForm :state="coverForm"  @submit="updateAll"  :schema="schema">

              <div class="flex flex-col  mt-y">

                <div class="flex-1 min-h-80">
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

          </UContainer>
        </div>
        <div class=" text-sm text-black main flex" v-show="mode === 'default'">
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
