import type {RedditBook} from "~/types/RedditBook";
import type ApiService from "~/types/ApiService";

const redditBook = import('~/storage/redditBook.json') as unknown as Promise<RedditBook>

export default class LocalApiService implements ApiService{

    async findByLink(link: string) {
         const book = await redditBook
        const reddit: RedditBook = {
            name: book.name,
            pages: book.pages,
            author: book.author
        }
        return Promise.resolve({
            data:reddit
        })
    }
    async findBySeeker(params : {alias:string, criteria:string}) {
        const book = await redditBook
        return Promise.resolve({
            data: book
        })
    }
}



