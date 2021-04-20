import { environment } from "src/environments/environment";

export const metadata = {
    top_nav: [
        { title: 'Roadmap', fragment: '#roadmap' },
        { title: 'Contract', url: environment.contractAddress },
        { title: 'WhitePaper', url: environment.whitepaper },
        {
            title: 'More', items: [
                { title: 'DAO', fragment: '#dao' },
                { title: 'NFT', fragment: '#nft' },
            ]
        },
    ],
    bottom_nav: [
        {
            title: 'NCAT TOKEN',
            class: "col-md-4",
            items: [
                {
                    content: `<div class="text-muted">NCAT Token is a community driven, fair launched DeFi Token. We continue to build based on <a href="//dao.ncat.fun" target="_blank">community self governance</a>.</div>`,
                }
            ],
        },
        {
            title: 'Information', items: [
                { title: 'DAO', url: environment.daoaddress },
                { title: 'Features', fragment: '#features' },
                { title: 'Contract', url: environment.contractAddress },
                { title: 'WhitePaper', url: environment.whitepaper },
                { title: 'Contact Us', url: environment.contactus },
                { title: 'Tokenomics', fragment: '#tokenomics' },
                { title: 'Roadmap', fragment: '#roadmap' },
            ],
        },
        {
            groups: [
                {
                    title: 'Price', items: [
                        { title: 'CoinMarketCap', url: environment.coinmarketcap },
                        { title: 'CoinGecko', url: environment.coingecko },
                        { title: 'Poocoin', url: environment.poocoin },
                    ],
                },
                {
                    title: 'Trade',
                    items: [
                        { title: 'PancakeSwap', url: environment.pancakeswap },
                        { title: 'WhiteBit', url: environment.whitebit },
                    ]
                },
            ],
        },
        {
            title: 'Follow NCAT', items: [
                { icon: 'star', title: 'Discord', url: environment.discord },
                { icon: 'like', title: 'Telegram', url: environment.telegram },
                { icon: 'twitter', title: 'Twitter', url: environment.twitter },
                { icon: 'instagram', title: 'Instagram', url: environment.instagram },
                { icon: 'github', title: 'Github', url: environment.github },
                { icon: 'medium', title: 'Medium', url: environment.medium },
            ],
        },
    ]

}