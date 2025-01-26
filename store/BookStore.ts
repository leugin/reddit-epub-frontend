import {defineStore} from "pinia";
import type {RedditBook} from "~/types/RedditBook";
import {show, store} from "~/services/api/v1/reddit";

const initialState= {
    book: undefined as RedditBook|undefined
}
export const BookStore = defineStore('bookStore',{
    state: () => ({...initialState }),
    actions:{
       async findBySeeker(params : {alias:string, criteria:string}) {
            const { $api } = useNuxtApp()
           return await $api.findBySeeker(params)
        },
        async show(uuid: string) {
            const response   = await show(uuid)
            this.book = response.data
            return response
        },
        updatePage(page:{html:string}, index:number){
            if (this.book){
                this.book.content[index].content = page.html
            }
        },
        deletePage(index:number){
            if (this.book){
                this.book.content.splice(index,1)
            }
        },
        store(uuid:string){
            return store(uuid, this.book as RedditBook)
        },
        update(uuid:string){
            return store(uuid, this.book as RedditBook)
        },
    }
})
