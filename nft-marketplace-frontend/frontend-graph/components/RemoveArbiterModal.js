import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketPlace.json";
import { useNotification } from "web3uikit";

export default function RemoveArbiterModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
    arbiter,
}) {
    const dispatch = useNotification();
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemoveArbiterSuccess = async (tx) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "Arbiter Removed",
            title: "Arbiter Removed - please refresh the page",
            position: "topR",
        });
        setIsRemoving(false);
        onClose && onClose();
        setTimeout(function () {
            location.reload();
        }, 3000); //3 seconds
    };

    const { runContractFunction: removeArbiter } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "removeArbiter",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    });

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <h2 className="text-xl font-bold mb-4">Remove Arbiter</h2>
                <div className="text-xs mb-4"> current Arbiter is: {arbiter} </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        onClick={onClose}
                        disabled={isRemoving}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => {
                            setIsRemoving(true);
                            removeArbiter({
                                onError: (error) => {
                                    console.log(error);
                                    setIsRemoving(false);
                                    onClose && onClose();
                                },
                                onSuccess: handleRemoveArbiterSuccess,
                            });
                        }}
                        disabled={isRemoving}
                    >
                        {isRemoving ? "Removing..." : "Confirm"}
                    </button>
                </div>
                {isRemoving && (
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
