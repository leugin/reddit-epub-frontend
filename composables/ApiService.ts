import LocalApiService from "~/services/api/local.api.service";
import FakerApiService from "~/services/api/faker.api.service";
import AxiosApiService from "~/services/api/axios.api.service";

export const  useApiService = (driver:string) => {
      switch(driver) {
          case 'faker': return new FakerApiService()
          case 'axios': return new AxiosApiService(useRuntimeConfig().public.api)
        default: return new LocalApiService()
     }
}
