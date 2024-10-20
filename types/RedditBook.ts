export interface RedditPage {
    title:string,
    created:string,
    content:string
}

export interface RedditBook {
    name: string,
    author: string,
    cover?: string,
    description?: string,
    content: RedditPage[]
}
