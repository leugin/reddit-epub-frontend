import {get} from "~/services/api/http.api";

const  find = async (search: string|null = ''): Promise<{data:{data:any[], meta:{
    total:number,
            page: number,
            last_page:number
        } }}> => {
    const response = await  get(`api/v1/reddit/books`, {search})
    return Promise.resolve({
        data:  response.data
    })}

export {

    find
}
