<script setup lang="ts">
import {BookStore} from "~/store/BookStore";
const bookStore = BookStore()

const router = useRouter();
const linkForm = reactive({
  link: undefined,
  search: undefined,
  aliases: undefined,
})

const sendForm = async  ()=> {
  if (linkForm.link) {
    const boot = await bookStore.findByLink(linkForm.link)
    if (boot){
      await router.push({
        path:'/book'
      })
    }

  }

}

const searchable = ref(false)
</script>

<template>

  <div class=" min-h-screen	flex flex-col ">
    <u-container>
      <div class=""> <h1 class="text-5xl py-9"> Generate your reddit Epub Here</h1></div>

    </u-container>
    <div class="my-auto">

      <div class="grid md:grid-cols-2">
        <div class="flex">
          <img src="~/assets/images/animations/Animated-GIF-Banana.gif" alt="reddit example" class="m-auto">
        </div>
        <div class="flex">
          <UContainer class="my-auto w-full">
            <UForm :state="linkForm"  @submit="sendForm"  >

              <div class="flex flex-col  mt-y">
                <div class="flex-none mb-9">
                  <UCheckbox   v-model="searchable" name="searchable" label="Use seeker" />
                </div>
                <div class="flex-1 min-h-80">
                  <u-form-group label="link" name="link" class="mb-9" v-if="!searchable">
                    <UInput v-model="linkForm.link"></UInput>
                  </u-form-group>
                  <u-form-group label="Aliases" name="aliases" class="mb-9" v-if="searchable">
                    <UInput v-model="linkForm.aliases"></UInput>
                  </u-form-group>
                  <u-form-group label="Find" name="by" class="mb-9" v-if="searchable">
                    <UInput v-model="linkForm.search"></UInput>
                  </u-form-group>
                </div>
                <div class="flex-none flex">
                  <UButton type="submit" class="mx-auto px-14 "  >
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
</template>

<style scoped>

</style>
