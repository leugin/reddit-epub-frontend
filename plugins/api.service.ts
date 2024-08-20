import type ApiService from "~/types/ApiService";
import {useApiService} from "~/composables/ApiService";

export default defineNuxtPlugin( async (nuxtApp) => {
     const driver = useRuntimeConfig().public.api_driver
    console.log(driver)
    return {
        provide: {
            api: useApiService(driver) as ApiService
        }
    }
})
