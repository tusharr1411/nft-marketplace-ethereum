import { useQuery,gql } from "@apollo/client";

// const GET_ACTIVE_ITEMS = gql`
//     {
//         activeItems(first: 5,) {
//             id
//             buyer
//             seller
//             nftAddress
//             tokenId
//             price
//         }
//     }
// `


const GET_ACTIVE_ITEMS = gql`
    query GetActiveItems( $nftAddress: String!, $tokenId: Int!) {
        activeItems(where: { nftAddress: $nftAddress, tokenId: $tokenId }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`;


export default function GraphExample(){
    const {loading, error, data} = useQuery(GET_ACTIVE_ITEMS,{
        variables: {nftAddress:"0xae68dd99a19d85948c7e531e20f1970e06ccf8f0", tokenId:6 }
    })

    console.log(data)
    return(
        <>
        <div> Graph example </div>
        </>
    )
}