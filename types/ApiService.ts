import type {RedditBook} from "~/types/RedditBook";

export default interface ApiService {
    findByLink(url:string):Promise< {data:RedditBook}>;
    findBySeeker (params : {alias:string, criteria:string}):Promise< {data:RedditBook}>;

}
