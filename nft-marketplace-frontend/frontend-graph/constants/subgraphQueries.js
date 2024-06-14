import { useQuery, gql } from "@apollo/client";

const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(first: 20, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`;


const GET_NFT = gql`
    query GetNFT( $nftAddress: String!, $tokenId: Int!) {
        activeItems(where: { nftAddress: $nftAddress, tokenId: $tokenId,buyer: "0x0000000000000000000000000000000000000000" }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
            arbiter
            arbiterSetTimestamp
        }
    }
`;


const GET_YOUR_LISTINGS = gql`
    query GetYourNFT( $seller: String!){
        activeItems(where: {seller: $seller,buyer: "0x0000000000000000000000000000000000000000"}) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`;



export { GET_ACTIVE_ITEMS,GET_NFT, GET_YOUR_LISTINGS };