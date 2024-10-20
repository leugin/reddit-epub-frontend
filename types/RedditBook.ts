export interface RedditPage {
    title:string,
    created:string,
    content:string
}

export interface RedditBook {
    title: string,
    author: string,
    cover?: string,
    description?: string,
    content: RedditPage[]
}
