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

}
