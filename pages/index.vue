<script setup lang="ts">
import {BookStore} from "~/store/BookStore";
import {object, string} from "yup";
const bookStore = BookStore()

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
    const boot = await bookStore.findBySeeker({
      alias: linkForm.aliases,
      criteria:linkForm.search
    })
    if (boot){
      await router.push({
        path:'/book'
      })
    }
  }


}

</script>

<template>

  <div class=" min-h-screen	flex flex-col ">
    <u-container>
      <div class=""> <h1 class="text-5xl py-9"> Generate your reddit Epub Here</h1></div>

    </u-container>
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
                    <UInput v-model="linkForm.aliases"></UInput>
                  </u-form-group>
                  <u-form-group label="Find" name="search" class="mb-9" >
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
