import type {RedditBook} from "~/types/RedditBook";
import {get, post, put} from "~/services/api/http.api";

const show = async (uuid: string)=> {
    const response = await get(`/api/v1/reddit/books/${uuid}`)
    const content = (typeof  response.data == 'string' ? JSON.parse(response.data): response.data) as unknown as RedditBook
    return Promise.resolve({
        data:  content
    })
}

const store = async (uuid:string, book: RedditBook)=> {
    const response = await post(`/api/v1/reddit/books/${uuid}`, book)
    return Promise.resolve({
        data:  response.data
    })
}
const update = async (uuid:string, book: RedditBook)=> {
    const response = await put(`/api/v1/reddit/books/${uuid}`, book)
    return Promise.resolve({
        data:  response.data
    })
}

const findBySeeker = async (params: {alias: string, criteria: string}) => {
    const response  =  await get('/api/v1/reddit/find', {
        sub_reddit: params.alias,
        search: params.criteria
    })
    return Promise.resolve({
        data: {
            url:response.data.url,
            uuid: response.data.uuid,
            book: response.data.book
        }
    })
}

export {show, store, findBySeeker, update }
