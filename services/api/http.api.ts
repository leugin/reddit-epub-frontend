import axios, {type AxiosInstance} from "axios";

let httpInstance: any | AxiosInstance= null
const httpFactory =  (base: string | null = null)=> {
    const instance = axios.create({
        baseURL: base ?? useRuntimeConfig().public.api,
    })

    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    })
    instance.interceptors.response.use((response)=> {
        return {
            status: response.status,
            ...response.data
        };
    }, (error)=> {
        return Promise.reject(error)
    })

    return instance

}

const useHttp = () => {
    if (!httpInstance) {
        httpInstance = httpFactory()
    }
    return httpInstance
}

const post = (url: string, data: any) => {
    return useHttp().post(url, data)
}
const get = (url: string, params : any = {}) => {
    return useHttp().get(url, {params})
}

const put = (url: string, data: any) => {
    return useHttp().put(url, data)
}
const del = (url: string) => {
    return useHttp().delete(url)
}
export {useHttp, post, get, put, del}

