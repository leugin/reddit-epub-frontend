import LocalApiService from "~/services/api/local.api.service";
import FakerApiService from "~/services/api/faker.api.service";

export const  useApiService = (driver:string) => {
      switch(driver) {
          case 'faker': return new FakerApiService()
        default: return new LocalApiService()
     }
}
