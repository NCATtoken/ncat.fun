export interface Metadata {
    top_nav?: Links[];
    bottom_nav?: Links[];
    fold_content?: string;
}
export interface LinkItems {
    title?: string;
    fragment?: string;
    url?: string;
    icon?: string;
    content?: string;
}

export interface Links {
    title?: string;
    class?: string;
    fragment?: string;
    url?: string;
    groups?: Links[],
    items?: LinkItems[];
}

export interface Price {
    burn?: string,
    holders?: string,
    marketcap?: string,
    percentage?: string,
    price?: any,
    supply?: string,
    time?: number,
}

export interface Webpage {
    id: string;
    slug?: string;
    title?: string;
    content?: string;
    published_at?: string;
    author?: string;
    likes?: number;
    summary?: string;
}

export interface Merchandise {
    id: string;
    title?: string;
    slug?: string;
    content?: string;
    author?: string;
    likes?: number;
    media: Media[];
    price?: number;
    preorder?: boolean;
    out_of_stock?: boolean;
    published_at?: string;
}

export interface Media {
    mime?: string;
    name?: string;
    url?: string;
    formats: { small: Media, thumbnail: Media };
}

export class Cart {
    items: { product: Merchandise, quantity: number, amount: number }[] = [];
    subtotal: number = 0;
    tax: number = 0;
    shipping: number = 0;
    discount: number = 0;
    total: number = 0;
    address: {
        name?: string,
        email?: string,
        phone?: string,
        address?: string,
        address2?: string,
        zipcode?: string,
        city?: string,
        state?: string,
        country?: string,
    } = {};
    status: string = 'new';
    wallet_address: string = '';

    constructor() {
    }

}