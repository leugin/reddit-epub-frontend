import type {RedditBook} from "~/types/RedditBook";
import type ApiService from "~/types/ApiService";


export default class LocalApiService implements ApiService{

    async findBySeeker(params : {alias:string, criteria:string}) {
        const book:RedditBook = {
            name: "Book 1",
            author: "Author 1",
            content: []
        }
        return Promise.resolve({
            data: {
                url:'http://localhost:8080',
                uuid:'XXXXXXXXX',
                book
            }
        })
    }

    async show(uuid: string): Promise<{ data: RedditBook }> {
        const book:RedditBook = {
            name: "Book 1",
            author: "Author 1",
            content: []
        }
        return Promise.resolve({data: book});
    }

    async store(uuid: string, book: RedditBook): Promise<{ data: { url: string } }> {
        return Promise.resolve({data: {url: ""}});
    }

    put(uuid: string, book: RedditBook) {
        return Promise.resolve({
            data: {
                url:'http://localhost:8080',
                uuid:'XXXXXXXXX',
                book
            }
        })
    }
}



