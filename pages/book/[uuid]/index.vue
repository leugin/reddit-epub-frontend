<script setup lang="ts">
import {BookStore} from "~/store/book.store";
import {onMounted} from "vue";
import SimpleModal from "~/components/shared/ConfirmModal.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import type {RedditPage} from "~/types/RedditBook";
import BookNav from "~/components/book/[uuid]/BookNav.vue";
import BookPanel from "~/components/book/[uuid]/BookPanel.vue";
import BookCoverForm from "~/components/book/[uuid]/BookCoverForm.vue";
import BookDefault from "~/components/book/[uuid]/BookDefault.vue";
import BookPageForm from "~/components/book/[uuid]/BookPageForm.vue";
import {erroToMsj} from "~/services/api/tools";

const bookStore = BookStore()
const route = useRoute();
const modal = useModal()
const alerts = useToast()
const selectedItem = ref<any>(null)
const queueLoading = ref(0)
const panel = ref();
const bookPageForm = ref<typeof BookPageForm| null>(null)
const mode = ref<'default'|'editor'|'cover'>('default')
let content = ref<any[]>([]);
const htmlContent = ref('')

const coverForm = ref({
  description: '',
  title: '',
  cover: '',
})

const pageHeadForm = ref({
  title: ''
})
const mouseCoordinate = reactive({
  x: 0,
  y: 0,
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
    coverForm.value.title = response.data.title ?? ''
    coverForm.value.cover = response.data.cover ?? ''
    coverForm.value.description = response.data.description ?? ''
  }
  window.addEventListener('keydown', navigationEvent)
  window.addEventListener('mousemove', mouseMovement)

})

onUnmounted(()=> {
  window.removeEventListener('keydown', navigationEvent)
  window.removeEventListener('mousemove', mouseMovement)
})


const isLoading = computed(()=> queueLoading.value !== 0);

const formIsPristine = computed(()=> bookPageForm?.value?.isPristine())


const updatePage = (newPage: any, id:number) => {
  const  index = content.value.findIndex(value => value?.id === id);
  if(index != -1){
    content.value[index].content = newPage.content
    content.value[index].title = newPage.title

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

const setPageData = (page: {id:number, title:string, content:string})=> {
  selectedItem.value = { ...page }
  htmlContent.value = page.content
  pageHeadForm.value.title = page.title
  mode.value = 'editor'

}
 const selectPage = ( page: {id:number, title:string, content:string} )=> {
  if (selectedItem.value && !formIsPristine.value){
    confirmModal().then((isYes) => {
      if (isYes) {
        if (bookStore.book){
          const cp:RedditPage = {
            ...selectedItem.value,
            content: bookPageForm?.value?.html()
          }
          updatePage(cp, selectedItem.value.id )
         }
      }
      setPageData(page)
    })
  } else  {
    setPageData(page)
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
    bookStore.book.cover = coverForm.value.cover
    bookStore.book.description = coverForm.value.description
    bookStore.book.title = coverForm.value.title
    const response =  await bookStore.store(route.params.uuid)
    queueLoading.value = queueLoading.value - 1
    return response

  }
  return Promise.reject('book it is not valid')
}

const updateAll = async ()=> {
  if (selectedItem.value){
    const data = bookPageForm?.value?.formData()
    savePage(data)

  }
  await update()
  bookPageForm?.value?.setPristine(true)

}

const saveCover = async (form: {title:string, cover:string, description:string })=> {
  queueLoading.value++
  coverForm.value = form
  await  updateAll()
  queueLoading.value--

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
    bookStore.book.cover = coverForm.value.cover
    bookStore.book.description = coverForm.value.description
    bookStore.book.title = coverForm.value.title
    try {
      const response =  await bookStore.update(route.params.uuid)
      queueLoading.value = queueLoading.value - 1
      alerts.add({
        title:'Guardado',
        timeout:5
      })
      return response
    }catch (e: any) {
      queueLoading.value = queueLoading.value - 1
      alerts.add({
        title: erroToMsj(e),
        timeout:5
      })
    }


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
const savePage = (page: {title: string, content: string }) => {
   if (selectedItem.value) {
     const cp:RedditPage = {
       ...selectedItem.value,
       content: page.content,
       title: page.title
     }
     updatePage(cp, selectedItem.value.id )
   }
}
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
    <book-nav :is-loading="isLoading" @save-book="saveBook" @update-all="update()" ></book-nav>
    <div class="flex h-full " id="body" style="height: calc(100vh - 100px)">

      <div id="panel" ref="panel" class=" flex w-48	flex-col panel" >
        <book-panel :content="content" :selected-item="selectedItem"
        @delete-page="deletePage"
        @select-page="selectPage"
        @selected-cover="mode = 'cover'"
        />
      </div>
      <div class=" flex flex-1 bg-white flex-col overflow-y-auto overflow-x-hidden " style="max-height: 100vh;">
        <div class=" text-sm text-black main" v-show="mode === 'editor'">
          <book-page-form
              :selected-item="selectedItem" :is-loading="isLoading"
              ref="bookPageForm"
          @save="savePage"
          />
        </div>
        <div class=" text-sm bg-black main h-full" v-show="mode === 'cover'">
          <book-cover-form :is-loading="isLoading" :data="coverForm"  v-if="mode === 'cover'" @save="saveCover" />
        </div>
        <div class=" text-sm text-black main flex" v-show="mode === 'default'">
          <book-default/>
        </div>

      </div>
    </div>
  </div>

</template>

<style scoped>


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
