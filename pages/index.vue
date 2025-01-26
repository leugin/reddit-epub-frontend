<script setup lang="ts">
import {AuthStore} from "~/store/auth.store";
import HomeNav from "~/components/shared/navs/HomeNav.vue";
import LatestBooks from "~/components/home/LatestBooks.vue";
import SearchInRedditForm from "~/components/home/SearchInRedditForm.vue";

const authStore = AuthStore()
const latestBook = ref<typeof LatestBooks|null>(null)

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
          <search-in-reddit-form/>
        </div>
      </div>

  </div>
  </div>
</template>

<style scoped>

</style>
