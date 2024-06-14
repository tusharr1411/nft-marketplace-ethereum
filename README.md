`#Ethereum` `#SEPOLIA` `#NEXT.JS` `SUBGRAPH`

# NFT Marketplace

An open decentralized NFT Marketplace built on ethereum (sepolia) smartcontract. It is an open platform where users can buy and sell their NFTs

#### Demo : [Link](<https://lync-nft-marketplace.vercel.app/)>)

#### Get some sepolia ETH : [Chainlink faucet](https://faucets.chain.link/sepolia) or [Alchemy faucet](https://www.alchemy.com/faucets/ethereum-sepolia)


## Project Description
The user can access the marketplace using this [Link](https://lync-nft-marketplace.vercel.app/), and he must have the Metamask or any other wallet installed. This interface, built with next.js, relies on the Moralis library to communicate with the smart contracts through Metamask. The data reflected on the front-end application is fetched from the marketplace contract events which are indexed using subgraph-indexer.




### NFT Marketplace features
The user can perform the following actions on this NFT Marketplace:


#### List NFT
Sellers can list their NFTs for sale on the marketplace. They fill out a form providing the NFT contract address, token ID, and the listing price in USD. Ownership of the NFT is verified using the ownerOf function of the NFT smart contract. If the seller is the owner, the marketplace contract is approved to transfer the NFT. The NFT is then listed on the marketplace with the specified USD price.

#### Update Listing
Users can update the price of an already listed NFT. If the user updates the listing price and the listing has an arbiter who was added within the last 24 hours, the arbiter will get an additional 24 hours to raise a dispute.

#### Cancel Listing
Sellers can cancel their listed NFTs, removing them from the marketplace. The NFT is then transferred back to the seller.

#### Add Arbiter
Sellers can add an arbiter to a listed NFT. The arbiter will have 24 hours to dispute the listing. If there is already an arbiter who was added more than 24 hours ago, only then can the seller change the arbiter.

#### Remove Arbiter
Sellers can remove the current arbiter from the listed NFT at any time.

#### Buy NFT
Users can buy NFTs from the marketplace by paying the price in ETH currency to the marketplace.

#### Raise Dispute
Arbiters can raise a dispute for a listed NFT if they are the arbiter for that listing and they were added as the arbiter within the last 24 hours.

#### Withdraw
Sellers can withdraw their proceeds from selling NFTs. The owner of the marketplace can also withdraw the commissions (10%) earned from others' sales on the marketplace.




## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.


### The repository


```
---nft-marketplace-backend  : is the backend directory which is hardhat project 
                              and contains smartcontract for marketplace
---nft-marketplace-frontend : is contains client side code & subgraph indexer
        |---frontend-graph  : is the nextjs app folder
        |---subgraph        : is a subgraph project made for listening the 
                              quering blockchain events.
```

<br>

 `clone` or `fork` the repository into your Github account:


```
$ git clone https://github.com/tusharr1411 LYNC-Solidity-Intern-Blockchain-Developer-Task
```

<br>

Follow these instructions to setup the projects:
* First Setup the & deploy the smartcontract using  [`nft-marketplace-backend`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task/tree/main/nft-marketplace-backend). Follow this [`README.md`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task/blob/main/nft-marketplace-backend/README.md ).
* Then setup your frontend using [`nft-marketplace-frontend`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task/tree/main/nft-marketplace-frontend) folder.
    * Before starting next app you need to build and deploy to subgraph studio using `nft-marketplace-backend/subgraph-indexer`. Follow this [`README.md`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task/blob/main/nft-marketplace-frontend/subgraph-indexer/README.md ).
    * start your frontend app using `nft-marketplace-backend/frontend-graph` folder. Follow this [`README.md`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task/blob/main/nft-marketplace-frontend/frontend-graph/README.md).

<br>













## 1. nft-marketplace-backend [Hardhatprojet]


After cloning the [`https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task) repo locally.

navigate to the backend repo using : 

```
$ cd LYNC-Solidity-Intern-Blockchain-Developer-Task/nft-marketplace-backend
```


### Installing

After that install the dependencies with:  `yarn` or `npm`.

```
$ yarn
```
or 
```
$ npm install
```

Then rename the `example.env` to `.env` and add values of enviornment variables inside this file.

### Deploying

To deploy smartcontract on testnet or mainnet ( let say sepolia) use these commands :

```
$ yarn hardhat deploy
```

Tadda... Your marketplace contract and a basic NFT will be deployed and varified on the etherscan. And also the frontend constants will be written in the frontend directory.

You can interact with `NftMarketplace.sol` smartcontract on [sepolia etherscan](https://sepolia.etherscan.io/) using it's address or just build your own frontend app using this [`README.md`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task/blob/main/nft-marketplace-frontend/frontend-graph/README.md)







<br>







## 2. subgraph-indexer [subgraph studio]



Before builidng your subgraph and deploying it to subgraph studio make sure you have deployed your contract and verified it on etherscan (sepolia). 



* follow this [Quick Start](https://thegraph.com/docs/en/quick-start/) to initialize, create, and deploy your subgraph to Subgraph Studio.
* After creating you subgraph just copy the code from [`schema.graphql`](link) and [`src/nft-market-place.ts`]() and paste to the respective files in your subgraph before deploying it to subgraph studio.

<br>











## 3 frontend-graph  [NextJS]


Note : Before getting start make sure you have deployed your NftMarketplace contract using this [`README.md`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task/blob/main/nft-marketplace-backend/README.md) and have build your and deployed subgraph for event listening using [`subgraph-indexer`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task/tree/main/nft-marketplace-frontend/subgraph-indexer) folder ( use this [`README.md`](https://github.com/tusharr1411/LYNC-Solidity-Intern-Blockchain-Developer-Task/blob/main/nft-marketplace-frontend/subgraph-indexer/README.md))




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
