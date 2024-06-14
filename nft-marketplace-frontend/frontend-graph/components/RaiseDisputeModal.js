import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketPlace.json";
import { useNotification } from "web3uikit";

export default function RaiseDisputeModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
}) {
    const dispatch = useNotification();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRaiseDisputeSuccess = async (tx) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "Dispute Raised",
            title: "Dispute raised - please refresh the page",
            position: "topR",
        });
        setIsProcessing(false);
        onClose && onClose();
        setTimeout(function () {
            location.reload();
        }, 3000); //3 seconds
    };

    const { runContractFunction: raiseDispute } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "raiseDispute",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    });

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <h2 className="text-xl font-bold mb-4">Raise Dispute</h2>
                <div className="text-xs mb-4">
                    NFT will be delisted from marketplace and transferred to seller
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => {
                            setIsProcessing(true);
                            console.log(
                                "KKKKKKKKKKKKKKKKKKLLLLLLLLLLLLLLLLLLL",
                                marketplaceAddress,
                                nftAddress,
                                tokenId
                            );
                            raiseDispute({
                                onError: (error) => {
                                    console.log(error);
                                    setIsProcessing(false);
                                    onClose && onClose();
                                },
                                onSuccess: handleRaiseDisputeSuccess,
                            });
                        }}
                        disabled={isProcessing}
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
