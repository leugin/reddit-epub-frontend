<script setup lang="ts">
import {BookStore} from "~/store/book.store";
import {object, string} from "yup";
import {AuthStore} from "~/store/auth.store";
import HomeNav from "~/components/shared/navs/HomeNav.vue";
import LatestBooks from "~/components/home/LatestBooks.vue";

const bookStore = BookStore()
const authStore = AuthStore()

const loading = ref(false)
const latestBook = ref<typeof LatestBooks|null>(null)

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
const successLogin = async ()=> {
  latestBook?.value?.load()

}

onMounted(()=> {
  if (authStore.isAuth) {
    successLogin()
  }
})


</script>

<template>

  <div>
    <div class=" 	flex flex-col ">
      <u-container>
        <div class=""> <h1 class="text-5xl py-9"> Generate your reddit Epub Here</h1></div>

        <home-nav @login-success="successLogin" @sing-in-success="successLogin"></home-nav>
      </u-container>
      <latest-books ref="latestBook"></latest-books>
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
