import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketPlace.json";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";

export default function AddArbiterModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
}) {
    const [arbiterAddress, setArbiterAddress] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const dispatch = useNotification();
    const { runContractFunction } = useWeb3Contract();

    const handleAddArbiterSuccess = async (tx) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "Arbiter Added",
            title: "Arbiter added - please refresh the page",
            position: "topR",
        });
        setIsProcessing(false);
        setArbiterAddress("");
        onClose && onClose();

        setTimeout(function () {
            location.reload();
        }, 3000); //3 seconds
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <h2 className="text-xl font-bold mb-4">Add Arbiter</h2>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Arbiter Address
                </label>
                <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                    value={arbiterAddress}
                    onChange={(event) => setArbiterAddress(event.target.value)}
                    disabled={isProcessing}
                />
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                    <button
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md  ${
                            !ethers.isAddress(arbiterAddress)
                                ? "bg-gray-500  border-gray-400 cursor-not-allowed"
                                : " hover:bg-blue-700 hover:shadow-2xl hover:scale-105"
                        }`}
                        disabled={!ethers.isAddress(arbiterAddress) || isProcessing}
                        onClick={() => {
                            setIsProcessing(true);
                            runContractFunction({
                                params: {
                                    abi: nftMarketplaceAbi,
                                    contractAddress: marketplaceAddress,
                                    functionName: "setArbiter",
                                    params: {
                                        nftAddress: nftAddress,
                                        tokenId: tokenId,
                                        newArbiter: arbiterAddress,
                                    },
                                },
                                onError: (error) => {
                                    console.log(error);
                                    setIsProcessing(false);
                                    onClose && onClose();
                                },
                                onSuccess: handleAddArbiterSuccess,
                            });
                        }}
                    >
                        {isProcessing ? "Processing..." : "Confirm"}
                    </button>
                </div>
                {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                        <svg
                            className="animate-spin h-10 w-10 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291A7.962 7.962 0 014 12H2c0 3.042 1.135 5.824 3 7.938l1-1.647z"
                            ></path>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}
