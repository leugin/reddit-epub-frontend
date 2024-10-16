export interface RedditPage {
    title:string,
    created:string,
    html:string
}

export interface RedditBook {
    name: string,
    author: string,
    cover?: string,
    description?: string,
    content: RedditPage[]
}
