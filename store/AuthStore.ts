import {defineStore} from "pinia";

const initialState:
    {
        user: {
            id: string,
            name: string,
            email: string,
        } | null
        token: string | null
    } =
    {
    user: null,
    token: null,
    }
export const AuthStore = defineStore('authStore',{
    state: () => ({...initialState }),
    getters: {
        isAuth: (state) => state.user !== null,
        authUser: (state) => state.user,
        authToken: (state) => state.token
    },
    actions:{
        async login(params : {email:string, password: string}) {
            const { $api } = useNuxtApp()
            const response = await $api.loginIn(params)
            if (response.data) {
                this.user = response.data.user
                this.token = response.data.access_token
                localStorage.setItem('user', JSON.stringify(response.data.user))
                localStorage.setItem('token', response.data.access_token)
            }
            return Promise.resolve(response);
        },
        logOut() {
            this.user = null
            this.token = null
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }

    }
})
