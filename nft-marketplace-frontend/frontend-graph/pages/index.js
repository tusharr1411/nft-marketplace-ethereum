import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { useMoralis } from "react-moralis";
import NFTBox from "@/components/NFTBox";
import networkMapping from "../constants/networkMapping.json";
import { useQuery } from "@apollo/client";
import { GET_ACTIVE_ITEMS } from "@/constants/subgraphQueries";

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis();
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
    const marketplaceAddress = chainId ? networkMapping[chainIdString].NftMarketPlace[0] : null;

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);

    return (
        <>
            <div className="relative">
                <div className=" ml-8 flex flex-col gap-5 ">
                    <h1 className="text-white py-4 px-4 font-bold ">
                        {isWeb3Enabled ? "Recently Listed" : " Please connect your wallet..."}{" "}
                    </h1>
                    <div className="flex flex-wrap justify">
                        {isWeb3Enabled ? (
                            loading || !listedNfts ? (
                                <div> Loading...</div>
                            ) : (
                                listedNfts.activeItems.map((nft) => {
                                    console.log(nft);
                                    const { price, nftAddress, tokenId, seller } = nft;
                                    return (
                                        <div className="m-4">
                                            <NFTBox
                                                price={price}
                                                nftAddress={nftAddress}
                                                tokenId={tokenId}
                                                seller={seller}
                                                key={`${nftAddress}${tokenId}`}
                                            />
                                        </div>
                                    );
                                })
                            )
                        ) : (
                            <div> </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
