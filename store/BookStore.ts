import {defineStore} from "pinia";
import type {RedditBook} from "~/types/RedditBook";

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
        }
    }
})
