import type {RedditBook} from "~/types/RedditBook";
import type ApiService from "~/types/ApiService";
import {string} from "yup";

const redditBook = import('~/storage/redditBook.json') as unknown as Promise<RedditBook>

export default class LocalApiService implements ApiService{

    async findBySeeker(params : {alias:string, criteria:string}) {
        const book = await redditBook
        return Promise.resolve({
            data: {
                url:'http://localhost:8080',
                uuid:'XXXXXXXXX',
                book
            }
        })
    }

    async show(uuid: string): Promise<{ data: RedditBook }> {
        const book = await redditBook

        return Promise.resolve({data: book});
    }

    async store(uuid: string, book: RedditBook): Promise<{ data: { url: string } }> {
        return Promise.resolve({data: {url: ""}});
    }
}



