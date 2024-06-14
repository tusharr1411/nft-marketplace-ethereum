import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useQuery } from "@apollo/client";
import { useEffect, useState } from 'react';
import { useWeb3Contract, useMoralis } from 'react-moralis';

import {GET_NFT} from "@/constants/subgraphQueries";
import nftAbi from '../constants/BasicNFT.json';
import networkMapping from "../constants/networkMapping.json";
import UpdateListingModal from "@/components/UpdateListingModal";
import CancelListingModal from "@/components/CancelListingModal";
import AddArbiterModal from "@/components/AddArbiterModal";
import RaiseDisputeModal from "@/components/RaiseDisputeModal";
import BuyItemModal from "@/components/BuyItemModal";
import RemoveArbiterModal from "@/components/RemoveArbiterModal";


const truncatString = (fullString, stringLength) => {
    if (fullString.length <= stringLength) return fullString;
    const separator = "...";
    const separatorLength = separator.length;
    const charsToShow = stringLength - separatorLength;
    const fronChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return (fullString.substring(0, fronChars) + separator + fullString.substring(fullString.length - backChars));
};

const unixSecondToFormatedTime = (unixTime)=>{
    const date = new Date(unixTime * 1000); // Convert to milliseconds
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = days[date.getUTCDay()];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    return `${time} ${dayOfWeek} ${month} ${day} ${year}`;
}

const formatRemainingTimeCountdown = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
};




export default function NftDetails() {

    const { isWeb3Enabled, chainId, account } = useMoralis();
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
    const marketplaceAddress = chainId ? networkMapping[chainIdString].NftMarketPlace[0] : null;

    const router = useRouter();
    const [nftAddress, setNftAddress] = useState(null);
    const [tokenId, setTokenId] = useState(null);

    useEffect(() => {
        if (router.isReady) {
            const { nftAddress, tokenId } = router.query;
            setNftAddress(nftAddress);
            setTokenId(parseInt(tokenId));
        }
    }, [router.isReady, router.query]);

    const  { loading, error, data } = useQuery(GET_NFT, {
        variables: { nftAddress, tokenId },
        skip: !nftAddress || !tokenId,
    });

    const [imageURI, setImageURI] = useState('');
    const [tokenName, setTokenName] = useState('');
    const [tokenDescription, setTokenDescription] = useState('');
    const [price, setPrice] = useState('');
    const [seller, setSeller] = useState('');
    const [arbiter, setArbiter] = useState('');
    const [arbiterSetTimestamp, setArbiterSetTimestamp] = useState('');
    const [remainingUnixSeconds, setRemainingUnixSeconds] = useState(0);

    const [isSeller, setIsSeller] = useState(false);
    const [isArbiter, setIsArbiter] = useState(false);
    const [showUpdateListingModal, setShowUpdateListingModal] = useState(false);
    const [showCancelListingModal, setShowCancelListingModal] = useState(false);
    const [showAddArbiterModal, setShowAddArbiterModal] = useState(false);
    const [showRaiseDisputeModal, setShowRaiseDisputeModal] = useState(false);
    const [showBuyItemModal, setShowBuyItemModal] = useState(false);
    const [showRemoveArbiterModal, setShowRemoveArbiterModal] = useState(false);


    const hideModal = () => {
        setShowUpdateListingModal(false)
        setShowCancelListingModal(false)
        setShowAddArbiterModal(false)
        setShowRaiseDisputeModal(false)
        setShowBuyItemModal(false)
        setShowRemoveArbiterModal(false)
    }

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: 'tokenURI',
        params: { tokenId },
    });

    async function updateUI() {
        const tokenURI = await getTokenURI();

        if (tokenURI) {
            const requestURL = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
            const tokenURIResponse = await (await fetch(requestURL)).json();
            const imageURI = tokenURIResponse.image;
            const imageURIURL = imageURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
            setImageURI(imageURIURL);
            setTokenName(tokenURIResponse.name);
            setTokenDescription(tokenURIResponse.description);
        }

        if (data && data.activeItems.length > 0) {
            const nft = data.activeItems[0];
            setPrice( nft.price);
            setSeller(nft.seller);
            setArbiter(nft.arbiter);
            setIsSeller(nft.seller === account);
            setIsArbiter(nft.arbiter === account);
            setArbiterSetTimestamp(nft.arbiterSetTimestamp);

            if(nft.arbiterSetTimestamp >0){
                const currentTime = Math.floor(Date.now() / 1000);
                const timeRemaining = (parseInt(nft.arbiterSetTimestamp) + 86400) - currentTime;
                setRemainingUnixSeconds(timeRemaining);
            }
        }
    }

    useEffect(() => {
        if (nftAddress && tokenId) {
            updateUI();
        }
    }, [data,account,nftAddress, tokenId,isSeller,isArbiter,marketplaceAddress]);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingUnixSeconds((prev) => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(interval);
    },[]);

    if(!price) return (
        <div className="flex text-white justify-center items-center h-screen">
            <p className="text-2xl"> NFT is Not Listed</p>
        </div>

    )



    return (
        <div className='ml-auto mr-auto max-w-[1700px] min-w-[1100px] ' >
            {isWeb3Enabled ? (
            <div className="flex flex-row px-10 py-2">


                <UpdateListingModal onClose={hideModal} isVisible={showUpdateListingModal} tokenId={tokenId} marketplaceAddress={marketplaceAddress} nftAddress={nftAddress}/>
                <AddArbiterModal onClose={hideModal} isVisible={showAddArbiterModal} tokenId={tokenId} marketplaceAddress={marketplaceAddress} nftAddress={nftAddress}/>
                <CancelListingModal onClose={hideModal} isVisible={showCancelListingModal} tokenId={tokenId} marketplaceAddress={marketplaceAddress} nftAddress={nftAddress}/>
                <RaiseDisputeModal onClose={hideModal} isVisible={showRaiseDisputeModal} tokenId={tokenId} marketplaceAddress={marketplaceAddress} nftAddress={nftAddress}/>
                <BuyItemModal onClose={hideModal} isVisible={showBuyItemModal} tokenId={tokenId} marketplaceAddress={marketplaceAddress} nftAddress={nftAddress} price={price}/>
                <RemoveArbiterModal onClose={hideModal} isVisible={showRemoveArbiterModal} tokenId={tokenId} marketplaceAddress={marketplaceAddress} nftAddress={nftAddress} arbiter={arbiter}/>



                <div className="w-1/2 max-w-[500px]" >
                    <div style={{ minWidth: '500px' }} className=" border-2 border-gray-400 mt-2 w-full bg-zinc-900 text-white rounded-lg p-6 shadow-lg">
                        <div className="bg-neutral-500	 border-2 border-gray-400 rounded-lg shadow-lg p-auto w-full max-w-lg mx-auto mt-3">
                            {imageURI ? (<img loader={() => imageURI} src={imageURI} alt={tokenName} className="w-full h-auto rounded-lg" />)
                            : (<div>Loading...</div>)
                            }
                        </div>
                        <h2 className="text-xl font-bold mt-16 mb-4">NFT Details</h2>
                        <div className=" text-sm flex flex-col space-y-4" >
                            <p>Collection Name: <span className="text-slate-400 text-xs" onClick={() => window.open(`https://sepolia.etherscan.io/address/${nftAddress}`, '_blank')}  style={{ cursor: 'pointer' }}>{tokenName}</span></p>
                            <p>Description: <span className="text-slate-400 text-xs" >{tokenDescription}</span></p>
                            <p>Token ID: <span className="text-slate-400 text-xs">{tokenId}</span></p>
                            <p>Price: <span className="text-slate-400 text-xs">{price? ethers.formatEther(price) : "--"} USD</span></p>
                            <p>Contract Address: <span className="text-slate-400 text-xs" onClick={() => window.open(`https://sepolia.etherscan.io/address/${nftAddress}`, '_blank')} style={{ cursor: 'pointer' }}>{nftAddress}</span></p>
                            <p>Seller: <span className="text-slate-400 text-xs"onClick={() => window.open(`https://sepolia.etherscan.io/address/${seller}`, '_blank')} style={{ cursor: 'pointer' }}>{seller}</span></p>
                        </div>
                    </div>
                </div>

                <div  style={{ minWidth: '500px' }}  className="w-1/2 flex flex-col items-start ml-10">
                    <p className="text-4xl text-white font-bold mt-12" onClick={() => window.open(`https://sepolia.etherscan.io/address/${nftAddress}`, '_blank')} style={{ cursor: 'pointer' }} >{tokenName} #{tokenId}</p>
                    <p className=" text-white  mb-12" >
                        Listed By 
                        <span className="text-blue-500" onClick={() => window.open(`https://sepolia.etherscan.io/address/${seller}`, '_blank')} style={{ cursor: 'pointer' }}> {isSeller ? "You" : truncatString(seller || "", 15)}</span>
                    </p>

                    {isSeller ? (
                        <div className="flex flex-col space-y-4">
                            <button
                                onClick={() => setShowUpdateListingModal(true)}
                                className="w-64 h-10 bg-blue-500 text-white font-bold text-xl tracking-wide px-4 rounded-lg border-4 border-gradient-to-r from-purple-400 to-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                                style={{ display: isSeller ? 'block' : 'none' }}
                            >
                                Update Price
                            </button>
                            
                            <button
                                onClick={() => setShowCancelListingModal(true)}
                                className="w-64 h-10 bg-red-500 text-white font-bold text-xl tracking-wide  px-4 rounded-lg border-4 border-gradient-to-r from-red-400 to-red-600 hover:bg-red-700 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                                style={{ display: isSeller ? 'block' : 'none' }}
                            >
                                Cancel Listing
                            </button> 

                            <button
                                onClick={() => setShowAddArbiterModal(true)}

                                className={`w-64 h-10 text-black font-bold text-xl tracking-wide px-4 rounded-lg border-4 shadow-lg transition-transform transform ${remainingUnixSeconds>0 ? 'bg-gray-500 border-gray-400 cursor-not-allowed' : 'bg-yellow-500 border-gradient-to-r from-yellow-400 to-yellow-600 hover:bg-yellow-700 hover:shadow-2xl hover:scale-105'}`}
                                disabled={remainingUnixSeconds>0}
                                style={{ display: isSeller ? 'block' : 'none' }}
                            >
                                Add Arbiter <span className='text-xs '>{remainingUnixSeconds > 0 ? formatRemainingTimeCountdown(remainingUnixSeconds) : ""}</span>
                            </button>

                            <button
                                onClick={() => setShowRemoveArbiterModal(true)}
                                className={`w-64 h-10 text-black font-bold text-xl tracking-wide px-4 rounded-lg border-4 shadow-lg transition-transform transform bg-yellow-500 border-gradient-to-r from-yellow-400 to-yellow-600 hover:bg-yellow-700 hover:shadow-2xl hover:scale-105`}
                                style={{ display: (isSeller && arbiter!="0x0000000000000000000000000000000000000000") ? 'block' : 'none' }}
                            >
                                Remove Arbiter 
                            </button> 
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            <button
                                onClick={() => { setShowBuyItemModal(true)}}
                                className="w-64 h-10 bg-green-600 text-white font-bold text-xl tracking-wide px-4 rounded-lg border-4 border-gradient-to-r from-green-400 to-green-600 hover:bg-green-900 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                                style={{ display: !isSeller ? 'block' : 'none' }}
                            >
                                Buy NFT
                            </button>
                            <button
                                onClick={() => setShowRaiseDisputeModal(true)}
                                className="w-64 h-10 bg-red-500 text-white font-bold text-xl tracking-wide px-4 rounded-lg border-4 border-gradient-to-r from-red-400 to-red-600 hover:bg-red-700 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                                style={{ display: isArbiter ? 'block' : 'none' }}
                            >
                                Raise Dispute <span className='text-xs'>{remainingUnixSeconds > 0 ? formatRemainingTimeCountdown(remainingUnixSeconds) : ""}</span>
                            </button>
                        </div>
                    )}

                    <div style={{ minWidth: '600px' }} className=" border-2 border-gray-400 mt-10 w-full bg-zinc-900 text-white rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Listing Details</h2>
                        <div className="text-sm flex flex-col space-y-4" >
                            <p>Price: <span className="text-slate-400 text-lg font-semibold">{price ? ethers.formatEther(price) : "--"} USD</span></p>
                            <p>Token ID: <span className="text-slate-400 font-bold">{tokenId}</span></p>
                            <p>Seller: <span className="text-slate-400 text-xs" onClick={() => window.open(`https://sepolia.etherscan.io/address/${seller}`, '_blank')} style={{ cursor: 'pointer' }}>{seller} {isSeller? "(You)" :""}</span></p>
                            <p>Arbiter : <span className="text-slate-400 text-xs" onClick={() => window.open(`https://sepolia.etherscan.io/address/${nftAddress}`, '_blank')}  style={{ cursor: 'pointer' }}>{arbiter == "0x0000000000000000000000000000000000000000" ? "No Arbiter" : arbiter} {isArbiter? "(You)" :""}</span></p>
                            <p>Arbiter Added On: <span className="text-slate-400 text-xs">{arbiterSetTimestamp > 0? unixSecondToFormatedTime(arbiterSetTimestamp) : "---"}</span></p>
                            <p>Arbiter Can Raise Dispute before: <span className="text-yellow-500 text-xs">{ formatRemainingTimeCountdown(remainingUnixSeconds) }</span></p>
                        </div>
                    </div>

                </div>
            </div>
            ) : (
                <div className="flex text-white justify-center items-center h-screen">
                    <p className="text-2xl"> Please connect your wallet. </p>
                </div>
            )}
        </div>
    );
}
