import type ApiService from "~/types/ApiService";
import axios, {type AxiosInstance} from 'axios';
import type {RedditBook} from "~/types/RedditBook";

export default class AxiosApiService implements ApiService{
    private instance: AxiosInstance;

    constructor( base:string ) {
        this.instance = axios.create({
            baseURL: base,
        });
        this.instance.interceptors.response.use((response)=> {
            return {
                status: response.status,
                ...response.data
            };
        }, (error)=> {
            return Promise.reject(error)
        })
    }
    async findBySeeker(params : {alias:string, criteria:string}) {
        const response  =  await this.instance.get('/api/v1/reddit/find', {
            params: {
                sub_reddit: params.alias,
                search: params.criteria
            }
        })
        return Promise.resolve({
            data: {
                url:response.data.url,
                uuid: response.data.uuid,
                book: response.data.book
            }
        })
    }
    async show(uuid:string){
        const response = await this.instance.get(`/api/v1/reddit/${uuid}`)
        const content = (typeof  response.data == 'string' ? JSON.parse(response.data): response.data) as unknown as RedditBook
        return Promise.resolve({
            data:  content
        })
    }
    async store(uuid:string, book: RedditBook){
        const response = await this.instance.post(`/api/v1/reddit/${uuid}`, book)
         return Promise.resolve({
            data:  response.data
        })
    }
}



