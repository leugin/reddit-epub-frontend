export interface RedditPage {
    title:string,
    created:string,
    html:string
}

export interface RedditBook {
    name: string,
    author: string,
    content: RedditPage[]
}
