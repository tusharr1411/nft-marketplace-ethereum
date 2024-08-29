
# NFT Marketplace [Hardhatprojet]

## Getting Started

After cloning the [`https://github.com/tusharr1411/nft-marketplace-ethereum`](https://github.com/tusharr1411/nft-marketplace-ethereum) repo locally.

navigate to the backend repo using : 

```
$ cd nft-marketplace-ethereum/nft-marketplace-backend
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

You can interact with `NftMarketplace.sol` smartcontract on [sepolia etherscan](https://sepolia.etherscan.io/) using it's address or just build your own frontend app using this [`README.md`](https://github.com/tusharr1411/nft-marketplace-ethereum/blob/main/nft-marketplace-frontend/frontend-graph/README.md)

