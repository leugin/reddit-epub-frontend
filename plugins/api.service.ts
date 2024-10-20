import type ApiService from "~/types/ApiService";
import {useApiService} from "~/composables/ApiService";

export default defineNuxtPlugin( async () => {
     const driver = useRuntimeConfig().public.api_driver
    return {
        provide: {
            api: useApiService(driver) as ApiService
        }
    }
})
