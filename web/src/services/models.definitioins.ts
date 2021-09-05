import { BigNumber } from "@ethersproject/bignumber";

export interface Metadata {
    top_nav?: Links[];
    bottom_nav?: Links[];
    fold_content?: string;
    where_to_trade?: string;
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
    variations_title?: string;
    variations2_title?: string;
    variations3_title?: string;
    variations?: ProductVariation[];
    variations2?: ProductVariation[];
    variations3?: ProductVariation[];
}

export interface ProductVariation {
    title: string;
}
export interface Media {
    mime?: string;
    name?: string;
    url?: string;
    formats: { small: Media, thumbnail: Media };
}

export class Cart {
    items: { product: Merchandise, variations: string[], quantity: number, amount: number }[] = [];
    subtotal: number = 0;
    tax: number = 0;
    shipping: number = 0;
    discount: number = 0;
    total: number = 0;
    wallet_address: string = '';

    constructor() {
    }

}
export class Order {

}


/**
-- 2021-09-05 17:06:51.0330
ALTER TABLE "public"."proposals" ADD COLUMN "budget" int8 DEFAULT 0;
ALTER TABLE "public"."proposals" ADD COLUMN "require_budget" bool DEFAULT 'false';
ALTER TABLE "public"."proposals" ADD COLUMN "contact" varchar(255);
ALTER TABLE "public"."proposals" ADD COLUMN "contact_type" varchar(255);
ALTER TABLE "public"."proposals" ADD COLUMN "has_expire" bool DEFAULT 'false';
ALTER TABLE "public"."proposals" ADD COLUMN "expire_date" timestamptz;
*/

export enum States {
    VOTING = "Voting",
    RESEARCH = "Research",
    FUNDING = "Funding",
    IMPLEMENTATION = "Implementation",
    COMPLETED = "Completed",
    REJECTED = "Rejected",
}

export interface Proposal {
    id?: number;
    title?: string;
    author?: string;
    content?: string;
    state?: string;
    expiration?: string;
    voters?: string[];
    funders?: string[];
    funded_amount?: number;
    for?: string;
    against?: string;
    budget?: number;
    require_budget: boolean;
    contact?: string;
    contact_type?: string;
    has_expire: boolean;
    expire_date?: string;
}