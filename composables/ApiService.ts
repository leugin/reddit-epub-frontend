import LocalApiService from "~/services/api/local.api.service";
import AxiosApiService from "~/services/api/axios.api.service";

export const  useApiService = (driver:string) => {
      switch(driver) {
          case 'local': return new LocalApiService()
          case 'axios': return new AxiosApiService(useRuntimeConfig().public.api)
        default: return new LocalApiService()
     }
}
