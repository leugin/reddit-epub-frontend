<script setup lang="ts">
import {BookStore} from "~/store/BookStore";
import {object, string} from "yup";
import type {DropdownItem} from "@nuxt/ui/dist/runtime/types";
import LoginForm from "~/components/auth/LoginForm.vue";
const bookStore = BookStore()

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

const items:DropdownItem[][] = [
  [{
    label: 'Login In',
    icon:'heroicons:arrow-right-end-on-rectangle-16-solid',
    click: () =>{openLogIn.value = true}
  },{
    label: 'Sign In',
    icon:'heroicons:user-plus'

  }]
]

const openLogIn = ref(false)
const openSingIn = ref(false)


</script>

<template>

  <div class=" min-h-screen	flex flex-col ">
    <u-container>
      <div class=""> <h1 class="text-5xl py-9"> Generate your reddit Epub Here</h1></div>
      <div class="login ">
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton color="white" label="Login" icon="i-heroicons-user-circle"  />
        </UDropdown>
      </div>

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
    <UModal v-model="openLogIn" >
      <div class="p-4">
        <LoginForm> </LoginForm>
      </div>
    </UModal>
  </div>
</template>

<style scoped>
.login{
  position: fixed;
  top: 40px;
  right: 40px;
  z-index: 3;
}
</style>
