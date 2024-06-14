import { ethers } from "ethers";
import {useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import nftAbi from "../constants/BasicNFT.json";
import nftMarketplaceAbi from "../constants/NftMarketPlace.json";
import networkMapping from "../constants/networkMapping.json";


export default function ListNFT() {
    const { chainId, account, isWeb3Enabled } = useMoralis();
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
    const marketplaceAddress = networkMapping[chainIdString].NftMarketPlace[0];

    const dispatch = useNotification();
    const { runContractFunction } = useWeb3Contract();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [price, setPrice] = useState("");


    async function formSubmitHandler(event) {
        event.preventDefault();
        setIsSubmitting(true);
        const nftAddress = event.target.nftAddress.value;
        const tokenId = parseInt(event.target.tokenId.value);
        const priceInEtherFormat = ethers.parseUnits(price, "ether").toString();


        const ownerOfNFT = await runContractFunction({
            params: {
                abi: nftAbi,
                contractAddress: nftAddress,
                functionName: 'ownerOf',
                params: { tokenId },
            }
        });


        if (!ownerOfNFT) {
            dispatch({
                type: "warning",
                message: "No NFT found !",
                title: "Owner Verification Failed",
                position: "topR",
            });
            setIsSubmitting(false);
            return;
        }

        const ownerAddress = ownerOfNFT.toString().toLowerCase();
        const userAddress = account.toString().toLowerCase();

        if (ownerAddress !== userAddress) {
            dispatch({
                type: "warning",
                message: "You are not the owner of this NFT",
                title: "Owner Verification Failed",
                position: "topR",
            });
            setIsSubmitting(false);
            return;
        }

        await runContractFunction({
            params: {
                abi: nftAbi,
                contractAddress: nftAddress,
                functionName: "approve",
                params: {
                    to: marketplaceAddress,
                    tokenId: tokenId,
                },
            },
            onError: (error) => {
                console.log(error);
                setIsSubmitting(false);
            },
            onSuccess: async (tx) => {
                await tx.wait();
                await runContractFunction({
                    params: {
                        abi: nftMarketplaceAbi,
                        contractAddress: marketplaceAddress,
                        functionName: "listItem",
                        params: {nftAddress: nftAddress,tokenId: tokenId,price: priceInEtherFormat,},
                    },
                    onError: (error) => {
                        console.log(error);
                        setIsSubmitting(false);
                    },
                    onSuccess: handleListNFTSuccess,
                });
            }
        });
    };

    const handleListNFTSuccess = async (tx) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "NFT Listed",
            title: "NFT Listed - Please check Your Listing page",
            position: "topR",
        });
        setIsSubmitting(false);
    };


    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    return (

        <>
        { isWeb3Enabled ? 
            (<div className="relative">
                {isSubmitting && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
                        <svg className="animate-spin h-16 w-16 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291A7.962 7.962 0 014 12H2c0 3.042 1.135 5.824 3 7.938l1-1.647z"></path>
                        </svg>
                    </div>
                )}

                <div className="mt-8 ml-auto mr-auto min-w-[500px] max-w-[800px]">
                    <div className="border-2 border-gray-400 mt-2 w-full bg-zinc-900 text-white rounded-lg p-6 shadow-lg">
                        <h2 className="text-2xl font-bold mb-14 text-white text-center">List your NFT</h2>

                        <form onSubmit={formSubmitHandler} className="mt-6 ml-auto mr-auto min-w-[400px] max-w-[600px]">
                            <div className="mb-4">
                                <label className="block text-xs text-gray-400 mb-2" htmlFor="nftAddress">NFT Address</label>
                                <input
                                    type="text"
                                    id="nftAddress"
                                    name="nftAddress"
                                    className="w-full h-10 px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs text-gray-400 mb-2" htmlFor="tokenId">Token ID</label>
                                <input
                                    type="number"
                                    id="tokenId"
                                    name="tokenId"
                                    className="w-full h-10 px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs text-gray-400 mb-2" htmlFor="price">Price (in USD)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    className="w-full h-10 px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                    step="0.01"
                                    required
                                    disabled={isSubmitting}
                                    value={price}
                                    onChange={handlePriceChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full h-16 px-4 py-2 text-white rounded-md shadow-lg transform transition-transform ${isSubmitting || price <=0 ? "bg-gray-500  cursor-not-allowed" : " bg-blue-500  hover:bg-blue-700 hover:scale-105 "} `}
                                disabled={isSubmitting || price <= 0}
                            >
                                {isSubmitting ? (
                                    <div className="flex justify-center items-center space-x-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291A7.962 7.962 0 014 12H2c0 3.042 1.135 5.824 3 7.938l1-1.647z"></path>
                                        </svg>
                                        <span>Listing...</span>
                                    </div>
                                ) : (
                                    "List NFT"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>) 
            : (
                <div className="flex text-white justify-center items-center h-screen">
                    <p className="text-2xl">Please connect your wallet.</p>                   
                </div>
            )}
        </>
    );
}
