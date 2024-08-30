import {defineStore} from "pinia";
import type {RedditBook, RedditPage} from "~/types/RedditBook";

const initialState= {
    book: undefined as RedditBook|undefined
}
export const BookStore = defineStore('bookStore',{
    state: () => ({...initialState }),
    actions:{
       async findByLink(link:string ) {
            const { $api } = useNuxtApp()
           const response   = await $api.findByLink(link)
           this.book = response.data
            return response
        },
        updatePage(page:RedditPage, index:number){
            if (this.book){
                this.book.pages[index].html = page.html
                this.book.pages[index].sub_title = page.sub_title
                this.book.pages[index].created = page.created
            }
        },
        deletePage(index:number){
            if (this.book){
                this.book.pages.splice(index,1)
            }
        }

    }
})
