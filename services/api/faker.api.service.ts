import type {RedditBook} from "~/types/RedditBook";
import type ApiService from "~/types/ApiService";

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

export default class FakerApiService implements ApiService{

    async findByLink(link: string) {
        return Promise.resolve({
            data: book
        })
    }
    async findBySeeker(params : {alias:string, criteria:string}) {
        return Promise.resolve({
            data: book
        })
    }
}



