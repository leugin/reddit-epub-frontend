<script setup lang="ts">
import {BookStore} from "~/store/book.store";
import {object, string} from "yup";
import {AuthStore} from "~/store/auth.store";
import HomeNav from "~/components/shared/navs/HomeNav.vue";

const bookStore = BookStore()
const authStore = AuthStore()

const loading = ref(false)

const router = useRouter();
const linkForm = reactive({
  search: undefined,
  aliases: undefined,
})
const schema = object({
  aliases: string().required('Please fill the author aliases'),
  search:string().required('Please fill the criteria to search')
})
const sendForm = async  ()=> {
  if (linkForm.search && linkForm.aliases) {
    loading.value = true
    const book = await bookStore.findBySeeker({
      alias: linkForm.aliases,
      criteria:linkForm.search
    })
    loading.value = false

    if (book){
      await router.push({
        path: `/book/${book.data.uuid}`
      })
    }
  }
}

const books = ref<any[]>([])
const booksPagination = ref({
  page:1,
  last_page:10,
  total:0
})
const successLogin = async ()=> {
   const {data: response}  = await bookStore.find()
  const {data, meta} = response
  books.value = data
  booksPagination.value.last_page = meta.last_page
  booksPagination.value.page = meta.page
  booksPagination.value.total = meta.total

}

const formatDate = (date:Date) => {
  const d = new Date(date)
  return d.toLocaleDateString()
}
const openLogIn = ref(false)
const openSingIn = ref(false)
onMounted(()=> {
  authStore.checkIsLogin()
  nextTick(()=> {
    if (authStore.isAuth){
      successLogin()
    }
  })

})
</script>

<template>

  <div>
    <div class=" 	flex flex-col ">
      <u-container>
        <div class=""> <h1 class="text-5xl py-9"> Generate your reddit Epub Here</h1></div>

        <home-nav @login-success="successLogin" @sing-in-success="successLogin"></home-nav>
      </u-container>
      <div class="pt-12 px-9">
        <div class=" mb-4 ">
          <h3>Latest books</h3>
        </div>
        <div class="">
          <div class="grid grid-cols-6 gap-6 "  v-if="authStore.isAuth">
            <UCard v-for="book in books" :key="book.uuid" >
              <template #header>
                <div class="flex flex-row">
                  <div class="flex-1">
                    <h6 class="">{{book.title}}</h6>
                    <span class="text-sm">{{book.author}}</span>
                  </div>
                </div>
              </template>
              <div class="flex flex-col">
                <div class="flex-none" v-if="book.cover">
                  <img :src="book.cover" alt="cover" class="w-32 h-32">
                </div>
                <div class="flex-1">
                  <p class="text-sm">{{book.description}}</p>
                </div>

              </div>
              <template #footer>
                <div class="flex flex-row">
                  <div class="flex-1">
                    <p class="text-sm">{{formatDate(book.created_at)}}</p>
                  </div>
                  <div class="flex-none">
                    <UButton color="white" icon="i-heroicons-arrow-right" :to="`/book/${book.uuid}`" />
                  </div>
                </div>
              </template>
            </UCard>
          </div>
        </div>
        <div class="pt-5" v-if="booksPagination.last_page > 1">
          <UPagination class="float-right" v-model="booksPagination.page" :page-count="booksPagination.last_page" :total="booksPagination.total" />
        </div>
      </div>
      <div class="min-h-screen flex flex-col">
        <div class="my-auto">

          <div class="grid md:grid-cols-2">
            <div class="flex">
              <img src="~/assets/images/animations/reading-read.gif" alt="reddit example" class="m-auto">
            </div>
            <div class="flex">
              <UContainer class="my-auto w-full">
                <UForm :state="linkForm"  @submit="sendForm"  :schema="schema">

                  <div class="flex flex-col  mt-y">

                    <div class="flex-1 min-h-80">
                      <u-form-group label="Aliases" name="aliases" class="mb-9"  >
                        <UInput v-model="linkForm.aliases" :loading="loading" :disabled="loading"></UInput>
                      </u-form-group>
                      <u-form-group label="Find" name="search" class="mb-9" >
                        <UInput v-model="linkForm.search" :loading="loading" :disabled="loading"></UInput>
                      </u-form-group>
                    </div>
                    <div class="flex-none flex">
                      <UButton type="submit" class="mx-auto px-14 " :loading="loading" :disabled="loading" >
                        <span class="text-white">Find</span>
                      </UButton>
                    </div>

                  </div>
                </UForm>

              </UContainer>

            </div>
          </div>
        </div>

      </div>

  </div>
  </div>
</template>

<style scoped>

</style>
