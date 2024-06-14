import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";
import networkMapping from "../constants/networkMapping.json";
import nftMarketplaceAbi from "../constants/NftMarketPlace.json";

export default function Balance() {
    const { chainId, account, isWeb3Enabled } = useMoralis();
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
    const marketplaceAddress = networkMapping[chainIdString].NftMarketPlace[0];
    const dispatch = useNotification();
    const { runContractFunction } = useWeb3Contract();
    const [proceeds, setProceeds] = useState("0");
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const handleWithdrawSuccess = async (tx) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "Proceeds withdrawn successfully",
            title: "Withdrawal Successful",
            position: "topR",
        });
        setIsWithdrawing(false);
        setupUI();
    };

    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {seller: account,},
                onError: (error) => console.log(error),
            },
        });
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString());
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            setupUI();
        }
    }, [proceeds, account, isWeb3Enabled, chainId]);

    return (
        


        <>
        {isWeb3Enabled ? 
            (<div className="relative">
                {isWithdrawing && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291A7.962 7.962 0 014 12H2c0 3.042 1.135 5.824 3 7.938l1-1.647z"></path>
                        </svg>
                    </div>
                )}
                <div className="mx-auto mt-48 w-full sm:max-w-[600px] md:max-w-[800px] bg-zinc-900 text-white border-2 border-gray-400 rounded-lg p-6 shadow-lg">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-2">Available Proceeds to Withdraw</h3>
                        <div className="text-gray-300">{ethers.formatEther(proceeds)} ETH</div>
                    </div>

                    <button
                        disabled={proceeds === "0" || isWithdrawing}
                        className={`w-full h-16 px-4 py-2 text-white rounded-md ${proceeds === "0" ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"} shadow-lg transform transition-transform ${isWithdrawing ? "bg-green-300 cursor-not-allowed" : ""}`}
                        onClick={() => {
                            setIsWithdrawing(true);
                            runContractFunction({
                                params: {
                                    abi: nftMarketplaceAbi,
                                    contractAddress: marketplaceAddress,
                                    functionName: "withdrawProceeds",
                                    params: {},
                                },
                                onError: (error) => {
                                    console.log(error);
                                    setIsWithdrawing(false);
                                },
                                onSuccess: handleWithdrawSuccess,
                            });
                        }}
                    >
                        {isWithdrawing ? (
                            <div className="flex justify-center items-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291A7.962 7.962 0 014 12H2c0 3.042 1.135 5.824 3 7.938l1-1.647z"></path>
                                </svg>
                                <span>Withdrawing...</span>
                            </div>
                        ) : (
                            "Withdraw"
                        )}
                    </button>
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
