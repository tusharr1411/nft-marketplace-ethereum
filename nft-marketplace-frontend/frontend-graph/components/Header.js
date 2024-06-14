import { ConnectButton } from "web3uikit";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
    const router = useRouter();

    const getLinkClass = (path) => {
        return router.pathname === path
            ? "px-3 py-1 rounded-full bg-white text-blue-500 font-bold hover:bg-blue-500 hover:text-white transition duration-300"
            : "px-3 py-1 rounded-full text-white hover:bg-blue-500 hover:text-white transition duration-300";
    };

    return (
        <nav className="p-2 bg-neutral-950 shadow-md flex flex-row justify-between items-center h-16 min-w-[1200px]">
            <div className="flex items-center">
                <h1 className="font-extrabold text-xl text-gray-100">NFT Marketplace</h1>
            </div>
            <div className="flex flex-row items-center space-x-2">
                <Link className={getLinkClass("/")} href="/">
                    Home
                </Link>
                <Link className={getLinkClass("/your-nft")} href="/your-nft">
                    Your Listings
                </Link>
                <Link className={getLinkClass("/list-nft")} href="/list-nft">
                    List NFT
                </Link>
                <Link className={getLinkClass("/balance")} href="/balance">
                    Balance
                </Link>
                <div className="ml-2">
                    <ConnectButton moralisAuth={false} />
                </div>
            </div>
        </nav>
    );
}
