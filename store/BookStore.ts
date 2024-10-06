import {defineStore} from "pinia";
import type {RedditBook} from "~/types/RedditBook";

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
            const { $api } = useNuxtApp()
            const response   = await $api.show(uuid)
            this.book = response.data
            return response
        },
        updatePage(page:{html:string}, index:number){
            if (this.book){
                this.book.pages[index].html = page.html
            }
        },
        deletePage(index:number){
            if (this.book){
                this.book.pages.splice(index,1)
            }
        },
        store(uuid:string){
            const { $api } = useNuxtApp()
            return $api.store(uuid, this.book as RedditBook)
        },
    }
})
