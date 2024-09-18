import type {RedditBook} from "~/types/RedditBook";
import type ApiService from "~/types/ApiService";

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
}



