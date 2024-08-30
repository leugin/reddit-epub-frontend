import type {RedditBook} from "~/types/RedditBook";

export default interface ApiService {
    findBySeeker (params : {alias:string, criteria:string}):Promise< {data:RedditBook}>;

}
