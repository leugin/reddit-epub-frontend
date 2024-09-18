import type ApiService from "~/types/ApiService";
import axios, {type AxiosInstance, type AxiosResponse} from 'axios';
import type {RedditBook} from "~/types/RedditBook";



const book:RedditBook = {
    name: 'faker',
    author: 'faker',
    pages:[
        {
            title: 'Faker title',
            sub_title: 'faker subtitle',
            created: '2023-06-12',
            html: '<h1>Faker</h1>'
        }
    ]
};
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
}



