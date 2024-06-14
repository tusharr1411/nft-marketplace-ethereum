import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useMoralis } from "react-moralis";
import NFTBox from "@/components/NFTBox";
import networkMapping from "../constants/networkMapping.json";
const inter = Inter({ subsets: ["latin"] });
import { GET_YOUR_LISTINGS } from "@/constants/subgraphQueries";
import { useQuery } from "@apollo/client";

export default function Home() {
    const { account, isWeb3Enabled, chainId } = useMoralis();
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
    const marketplaceAddress = chainId ? networkMapping[chainIdString].NftMarketPlace[0] : null;
    console.log(`NFT marketplace Address: ${marketplaceAddress}`);
    console.log(`Account: ${account}`);

    const { loading, error, data } = useQuery(GET_YOUR_LISTINGS, {
        variables: { seller: account },
        skip: !account,
    });

    console.log("Data from the GET_YOUR_LISTINGS Query:", data);

    return (
        <>
            <div className="ml-8 mr-8 flex flex-col gap-5">
                <h1 className="text-white py-4 px-4 font-bold ">
                    {isWeb3Enabled ? "Recently Listed" : " Please connect your wallet..."}{" "}
                </h1>
                <div className="flex flex-wrap justify">
                    {isWeb3Enabled ? (
                        loading ? (
                            <div>Loading...</div>
                        ) : error ? (
                            <div>Error: {error.message}</div>
                        ) : data && data.activeItems && data.activeItems.length > 0 ? (
                            data.activeItems.map((nft) => {
                                const { price, nftAddress, tokenId, seller } = nft;
                                return (
                                    <div className="m-4" key={`${nftAddress}${tokenId}`}>
                                        <NFTBox
                                            price={price}
                                            nftAddress={nftAddress}
                                            tokenId={tokenId}
                                            seller={seller}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <div className="mx-auto text-white"> You have no Listed NFTs </div>
                        )
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
        </>
    );
}
