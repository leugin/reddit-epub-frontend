import type {RedditBook} from "~/types/RedditBook";

type BookResponse = {
    data: {
        url:string,
        uuid:string,
        book:RedditBook
    }
}

export default interface ApiService {
    findBySeeker (params : {alias:string, criteria:string}):Promise<BookResponse>;
    show (uuid:string):Promise<{data: RedditBook}>;
    store (uuid:string, book: RedditBook):Promise<{data:{url:string}}>;
}
