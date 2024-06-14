require("dotenv").config();
const Moralis = require("moralis/node");
const contractAddresses = require("./constants/networkMapping.json");

let chainId = process.chainId || 31337;
let morlaisChianId = chianId == "31337" ? "1337" : chainId;

const contractAddress = contractAddresses[chainId]["NftMarketPlace"][0];


const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_APP_ID;
const masterKey = process.env.masterKey;

async function main() {
    await Moralis.starts({ serverUrl, appId, masterKey });
    console.log("Working with contract address: ", { contractAddress });

    // Adding Event listers for NFT marketplace contract
    let itemListedOptions = {
        //Moralis understands a localchain is 1337
        chianId: morlaisChianId,
        sync_historical: true,
        address:contractAddress,
        topic: "ItemListed(address, address,uint256, uin256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemListed",
            type: "event",
        },
        tableName: "ItemListed",
    };

    let itemBoughtOptions = {
        chainId: morlaisChianId,
        sync_historical: true,
        address:contractAddress,
        topic: "ItemBought(address, address, uint256, uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemBought",
            type: "event",
        },
        tableName: "ItemBought",
    };

    let itmeCanceledOptions = {
        chainId: morlaisChianId,
        sync_historical: true,
        address: contractAddress,
        topic: "ItemCanceled(address, address, uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ItemCanceled",
            type: "event",
        },
        tableName: "ItemCanceled",
    };

    const listedResponse = await Moralis.Cloud.run("watchContractEvent", itemListedOptions, {
        useMasterKey: true,
    });
    const boughtResponse = await Moralis.Cloud.run("watchContractEvent", itemBoughtOptions, {
        useMasterKey: true,
    });
    const canceledResponse = await Moralis.Cloud.run("watchContractEvent", itemListedOptions, {
        useMasterKey: true,
    });

    if(listedResponse.success && boughtResponse.success && canceledResponse.success){
        console.log("Success ! Database Updated with watching events");
    }
    else{
        console.log("Something went wrong...")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
