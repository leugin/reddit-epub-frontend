<script setup lang="ts">
import {BookStore} from "~/store/book.store";
import {AuthStore} from "~/store/auth.store";

const bookStore = BookStore()
const authStore = AuthStore()


const books = ref<any[]>([])
const booksPagination = ref({
  page:1,
  last_page:10,
  total:0
})

const formatDate = (date:Date) => {
  const d = new Date(date)
  return d.toLocaleDateString()
}

const load = async ()=> {
  const {data: response}  = await bookStore.find()
  const {data, meta} = response
  books.value = data
  booksPagination.value.last_page = meta.last_page
  booksPagination.value.page = meta.page
  booksPagination.value.total = meta.total

}
defineExpose({
  load
});
</script>

<template>
  <div class="pt-12 px-9"  v-if="authStore.isAuth">
    <div class=" mb-4 ">
      <h3>Latest books</h3>
    </div>
    <div class="">
      <div class="grid grid-cols-6 gap-6 " >
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
  <div></div>

</template>

<style scoped>

</style>
