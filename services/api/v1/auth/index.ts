import {post} from "~/services/api/http.api";

const loginIn =  async (params : {email: string, password: string})  => {
    const response = await post(`api/v1/auth/login`, params)
    return Promise.resolve({
        data:  response.data
    })
}


export {
    loginIn
}
