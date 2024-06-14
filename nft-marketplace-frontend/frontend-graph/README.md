
1. Home Page: default
    1. Show all listed NFTs(Active) : On click route to the NFT detail page
2. Your Listings: I
    1. Show NFTs listed by User : On click route to the NFT detail page
3. List NFT : Liste NFTs with nftAddress, tokenId, Price
4. Balance Page : User can withdraw their proceeds
5. NFT  Detail Page : 
    1. If User is Seller of that NFT - then show Updte Listing, Cancel Listing, Add Arbiter and/or Remove Arbiter buttons
    2. If User is Arbiter of the NFT - then show Buy NFT and Raise Dispute Button
    3. Show NFT Image with details



<br> <br> <br> 


# frontend-graph  [NextJS]

## Getting Started

Note : Before getting start make sure you have deployed your NftMarketplace contract using this [`README.md`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task/blob/main/nft-marketplace-backend/README.md) and have build your and deployed subgraph for event listening using [`subgraph-indexer`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task/tree/main/nft-marketplace-frontend/subgraph-indexer) folder ( use this [`README.md`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task/blob/main/nft-marketplace-frontend/subgraph-indexer/README.md))


After cloning the `https://github.com/tusharr1411 LYNC-Solidity-Intern-Blockchain-Developer-Task` repo locally,

Navigate to the frontend-graph repo using : 

```
$ cd LYNC-Solidity-Intern-Blockchain-Developer-Task/nft-marketplace-frontend/frontend-graph
```


### Installing

Install the dependencies with:  `yarn` or `npm`.

```
$ yarn
```
or 
```
$ npm install
```

Then rename the `example.env` to `.env` and add the values of `.env` variables ( Not needed actually)

And change this line in [`_app.js`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task/blob/2302b4e01a0b52734bb8191b455c5ca57437d502/nft-marketplace-frontend/frontend-graph/pages/_app.js#L10) according to your subgraph api link.

```js
uri: "https://api.studio.thegraph.com/query/66907/lync-nft-marketplace-2024/version/latest",
```

### Starting App

start your next app using :

```
$ yarn run dev
```

Tadda... Your frontend will start on [localhost](http://localhost:3000/).
