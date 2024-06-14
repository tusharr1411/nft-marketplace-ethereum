import "@/styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "@/components/Header";
import Head from "next/head";
import { NotificationProvider } from "web3uikit";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/66907/lync-nft-marketplace-2024/version/latest",
    //centralized https but still all the data is on decentralized graph network
     
});

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title> NFT Marketplace </title>
                <meta name="description" content="NFT marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </>
    );
}
