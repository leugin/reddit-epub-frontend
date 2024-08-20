export interface RedditPage {
    title:string,
    sub_title: string,
    created:string,
    html:string
}

export interface RedditBook {
    name: string,
    author: string,
    pages: RedditPage[]
}
