//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";



//Custom errors
error NftMarketPlace__NotArbiter();
error NftMarketPlace__NoProceeds();
error NftMarketPlace__NotNFTOwner();
error NftMarketPlace__TransferFailed();
error NftMarketPlace__PriceMustBeAboveZero();
error NftMarketPlace__NftHasNoArbiter(address nftAddress, uint256 tokenId);
error NftMarketPlace__NotListed(address nftAddress, uint256 tokenId);
error NftMarketPlace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketPlace__DisputeTimeExpired(address nftAddress, uint tokenId);
error NftMarketPlace__ListingIsAlreadyDisputed(address nftAddress, uint256 tokenId);
error NftMarketPlace__NotSeller(address nftAddress, uint256 tokenId, address seller);
error NftMarketPlace__PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error NftMarketPlace__AlreadyHasArbiter(address nftAddress, uint256 tokenId, address arbiter);
error NftMarketPlace__UnderDisputeTime(address nftAddress,uint256 tokenId,address currentArbiter,uint256 currentArbiterSetTimestamp);
error NotApprovedForMarketplace(address nftAddress, uint256 tokenId);



contract NftMarketPlace is ReentrancyGuard, ChainlinkClient {
    using Chainlink for Chainlink.Request;

    //--------------------------------------------------------------//
    //---------------------  Type Declaration  ---------------------//
    //--------------------------------------------------------------//
    struct Listing {
        uint256 price; // Price of the NFT in USD
        address seller; // Owner of that NFT
        address arbiter; // Arbiter for disputes
        bool disputed; // Flag indicating if the item is disputed
        uint256 arbiterSetTimestamp;
    }
    //If (currentTime - arbiterSetTimestamp) is more than one day, it cannot be set as disputed
    // Initially, arbiterSetTimestamp is zero, so (currentTimestamp - 0) > 1 => disputed = false
    // If the arbiter is set today, for the next 1 day, (currentTimestamp - arbiterSetTimestamp) < 1 day => disputed =  true
    // After 1 day, (currentTimestamp - arbiterSetTimestamp) > 1 day => disputed = false


    //--------------------------------------------------------------//
    //--------------------------  Events  --------------------------//
    //--------------------------------------------------------------//
    event ItemListed(address indexed seller,address indexed nftAddress,uint256 indexed tokenId,uint256 price,address arbiter,bool disputed,uint256 arbiterSetTimestamp);
    event ItemBought(address indexed buyer, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
    event ItemCanceled(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);
    event ArbiterAdded(address indexed arbiter, address indexed nftAddress, uint256 indexed tokenId, uint256 arbiterSetTimestamp);
    event DisputeRaised(address indexed arbiter, address indexed nftAddress, uint256 indexed tokenId);
    event RequestPrice(bytes32 indexed requestId, uint256 ethPriceInUsd);
    event ArbiterRemoved(address nftAddress,uint256  tokenId);


    //--------------------------------------------------------------//
    //---------------------  Global Variables  ---------------------//
    //--------------------------------------------------------------//
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds; // seller->earned
    address private immutable i_owner;
    /*      Chainlink Variable        */
    uint256 public ethPriceInUsd;
    bytes32 private jobId; // "ca98366cc7314957b8c012c72f05aeeb"
    uint256 private fee;

    //--------------------------------------------------------------//
    //-----------------------  Constructor   -----------------------//
    //--------------------------------------------------------------//

    constructor(address _chainlinkTokenAddress, address _chainlinkOracleAddress, bytes32 _jobId) {
        _setChainlinkToken(_chainlinkTokenAddress); //0x779877A7B0D9E8603169DdbD7836e478b4624789
        _setChainlinkOracle(_chainlinkOracleAddress); //0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD
        jobId = _jobId;
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
        i_owner = msg.sender;
    }

    //--------------------------------------------------------------//
    //-------------------------  Modifiers  ------------------------//
    //--------------------------------------------------------------//

    /* makes sure that nft is not listed already */
    modifier notListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {revert NftMarketPlace__AlreadyListed(nftAddress, tokenId);}
        _;
    }

    /* checks if the NFT owned by seller before listing */
    modifier isNFTOwner(address nftAddress,uint256 tokenId,address spender) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {revert NftMarketPlace__NotNFTOwner();}
        _;
    }

    /* makes sure that nft is listed alread */
    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {revert NftMarketPlace__NotListed(nftAddress, tokenId);}
        _;
    }

    /* use when disupted = false is needed */
    modifier notDisputed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.disputed) {revert NftMarketPlace__ListingIsAlreadyDisputed(nftAddress, tokenId);}
        _;
    }

    /* checks if the Address is the one who listedNFT */
    modifier isSeller(address nftAddress,uint256 tokenId,address _seller){
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (_seller != listing.seller) {revert NftMarketPlace__NotSeller(nftAddress, tokenId, _seller);}
        _;
    }

    /* Ensures that function executer is the Arbiter */
    modifier onlyArbiter(address nftAddress,uint256 tokenId,address user){
        if (user != s_listings[nftAddress][tokenId].arbiter) {revert NftMarketPlace__NotArbiter();}
        _;
    }

    /* Ensures that the dispute time limit has not expired so that the arbiter can raise a dispute (i.e., arbiter is not older than 1 day) */
    modifier disputeTimeNotExpired(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        uint256 currentTimestamp = block.timestamp;
        if (listing.disputed && listing.arbiterSetTimestamp + 1 days < currentTimestamp) {revert NftMarketPlace__DisputeTimeExpired(nftAddress, tokenId);}
        _;
    }

    /* make sure last arbiter is expired (arbiter is older than 1day) */
    modifier disputeTimeExpired(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        uint256 lastArbiterSetTimestamp = listing.arbiterSetTimestamp;
        uint256 currentTimestamp = block.timestamp;
        if (lastArbiterSetTimestamp + 1 days > currentTimestamp) {revert NftMarketPlace__UnderDisputeTime(nftAddress, tokenId, listing.arbiter, lastArbiterSetTimestamp);}
        _;
    }

    /* make sure listing has an arbiter ( other than address(0)) */
    modifier hasArbiter(address nftAddress, uint256 tokenId){
        Listing memory listing = s_listings[nftAddress][tokenId];
        if(listing.arbiterSetTimestamp<=0){revert NftMarketPlace__NftHasNoArbiter(nftAddress, tokenId);}
        _;
    }



    //--------------------------------------------------------------//
    //----------------------  Main Functions  ----------------------//
    //--------------------------------------------------------------//

    /*
     * @notice method for listing your NFT on the marketplace
     * @notice nft should be owned by msg.signer
     * @param nftAddress: Address of the NFT
     * @param tokenId: token Id of the NFT
     * @param price: sale price of the listed NFT in USD
     */
    function listItem(address nftAddress,uint256 tokenId,uint256 price) external notListed(nftAddress, tokenId) isNFTOwner(nftAddress, tokenId, msg.sender) nonReentrant {
        if (price <= 0) {revert NftMarketPlace__PriceMustBeAboveZero();}

        // Send the NFT to the contract. Transfer -> contract "hold the NFT.
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {revert NotApprovedForMarketplace(nftAddress, tokenId);}
        nft.transferFrom(msg.sender, address(this), tokenId); // because Our marketplace can handle ERC721
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender, address(0), false, 0);
        emit ItemListed(msg.sender, nftAddress, tokenId, price, address(0), false, 0);
    }

    /*
     * @notice: method for buying an NFT on the marketplace
     * @notice: nft should be listed on marketplace
     * @notice: nft should not be disputed on marketplace
     * @dev:After the NFT is sold, instead of sending the ethers to the seller immediately,
     *      we record the amount the seller can withdraw from this contract.
     *      This shifts the risk associated with transferring ether to the seller.
     * @param nftAddress: Address of the NFT
     * @param tokenId: token Id of the NFT
     */
    function buyItem(address nftAddress,uint256 tokenId) external payable nonReentrant isListed(nftAddress, tokenId) notDisputed(nftAddress, tokenId) {
        Listing memory listedItem = s_listings[nftAddress][tokenId];

        requestEthPrice(); // Ensure the latest ETH price is fetched from chainlink oracle
        require(ethPriceInUsd > 0, "ETH price not available");

        uint256 nftPriceInETH = (listedItem.price * 1e18) / ethPriceInUsd; //calculate the NFT price in ETH

        if (msg.value < nftPriceInETH) {revert NftMarketPlace__PriceNotMet(nftAddress, tokenId, nftPriceInETH);}
        uint256 commission = ((msg.value) * 10) / 100; //10% for the marketPlaceOwner
        uint256 sellerProceeds = msg.value - commission;

        // update the proceeds
        s_proceeds[listedItem.seller] += sellerProceeds;
        s_proceeds[i_owner] += commission;
        delete (s_listings[nftAddress][tokenId]); // delete the listing after it is sold
        IERC721(nftAddress).safeTransferFrom(address(this), msg.sender, tokenId);
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    /*
     * @notice: method for updating the listing of an NFT on the marketplace
     * @notice: nft should be listed on marketplace
     * @notice: msg.signer should be the one who listed NFT
     * @dev: Seller and arbiter will remain the same
     * @dev: After updating the listing if earlier there was no arbiter (address(0)) for the NFT then no Need to update the arbiterSetTimestamp
     *       If there was arbiter then arbiter will get one more day to raise dispute against updatedListing so we have updated arbiterSetTimestamp
     * @param nftAddress: Address of the NFT
     * @param tokenId: token Id of the NFT
     * @param newPrice: updated price of the NFT in USD
     */
    function updateListing(address nftAddress,uint256 tokenId,uint256 newPrice) external isListed(nftAddress, tokenId) isSeller(nftAddress, tokenId, msg.sender) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.arbiterSetTimestamp + 1 days > block.timestamp) {
            s_listings[nftAddress][tokenId].arbiterSetTimestamp = block.timestamp;
        }
        uint256 newArbiterSetTimestamp = s_listings[nftAddress][tokenId].arbiterSetTimestamp;
        s_listings[nftAddress][tokenId].disputed = false;
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice, listing.arbiter, false, newArbiterSetTimestamp);
    }

    /*
     * @notice: method to cancel the listing of an NFT on the marketplace and get back the NFT
     * @notice: NFT should be listed on marketplace
     * @notice: msg.signer should be the one who listed NFT
     * @param nftAddress: Address of the NFT
     * @param tokenId: token Id of the NFT
     */
    function cancelListing(address nftAddress,uint256 tokenId) external isListed(nftAddress, tokenId) isSeller(nftAddress, tokenId, msg.sender) {
        IERC721(nftAddress).safeTransferFrom(address(this), msg.sender, tokenId);
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    /*
     * @notice: method for withdrawing the proceeds from marketplace
     */
    function withdrawProceeds() external {
        uint256 proceed = s_proceeds[msg.sender];
        if (proceed <= 0) {revert NftMarketPlace__NoProceeds();}
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceed}("");
        if (!success) {revert NftMarketPlace__TransferFailed();}
    }

    //---------------------  Arbiter Functions   -------------------//
    /*
     * @notice: Method for setting or updating the arbiter of a listed NFT
     * @notice: NFT should be listed on marketplace
     * @notice: msg.signer should be the one who listed NFT
     * @notice: if there was any arbiter (other than address(0)), then it should be older than one 1 day
     * @param nftAddress: Address of the NFT
     * @param tokenId: token Id of the NFT
     * @param newArbiter: address of the arbiter
     */
    function setArbiter(address nftAddress,uint256 tokenId,address newArbiter) external isListed(nftAddress, tokenId) isSeller(nftAddress, tokenId, msg.sender) disputeTimeExpired(nftAddress, tokenId) {
        updateArbiter(nftAddress, tokenId, newArbiter, block.timestamp);
        emit ArbiterAdded(newArbiter, nftAddress, tokenId, block.timestamp);
    }


    /*
     * @notice: Method for removing the arbiter of a listed NFT
     * @notice: NFT should be listed on marketplace
     * @notice: msg.signer should be the one who listed NFT(seller)
     * @notice: nft should have an arbiter
     * @notice: remove arbiter means arbiter set to address(0) and arbiterSetTimestamp as zero
     * @param nftAddress: Address of the NFT
     * @param tokenId: token Id of the NFT
     */
    function removeArbiter(address nftAddress, uint256 tokenId) external isListed(nftAddress, tokenId) isSeller(nftAddress, tokenId, msg.sender) hasArbiter(nftAddress, tokenId){
        updateArbiter(nftAddress, tokenId, address(0), 0);
        emit ArbiterRemoved(nftAddress, tokenId);
    }

    /*
     * @notice: method for raising a dispute for a listing in marketplace
     * @notice: msg.signer should be the arbiter of the NFT
     * @notice: NFT should be listed on marketplace
     * @notice: NFT should not be disputed on marketplace
     * @notice: arbiter should not be older than 1 day
     * @param nftAddress: Address of the NFT
     * @param tokenId: token Id of the NFT
     */
    function raiseDispute(address nftAddress,uint tokenId) external onlyArbiter(nftAddress, tokenId, msg.sender) isListed(nftAddress, tokenId) notDisputed(nftAddress, tokenId) disputeTimeNotExpired(nftAddress, tokenId){
        handleDispute(nftAddress, tokenId);
    }

    /* solidity compiler can not handle more than 16 variables in Stack that's why created these functions */
    function updateArbiter(address nftAddress, uint256 tokenId, address newArbiter, uint256 timeStamp) private {
        s_listings[nftAddress][tokenId].arbiter = newArbiter;
        s_listings[nftAddress][tokenId].arbiterSetTimestamp = timeStamp;
    }

    function handleDispute(address nftAddress, uint256 tokenId) private {
        s_listings[nftAddress][tokenId].disputed = true;
        emit DisputeRaised(msg.sender, nftAddress, tokenId);
        IERC721(nftAddress).safeTransferFrom(address(this), s_listings[nftAddress][tokenId].seller, tokenId); // Transfer the NFT back to the seller
        emit ItemCanceled(s_listings[nftAddress][tokenId].seller, nftAddress, tokenId);
        delete (s_listings[nftAddress][tokenId]); // Clear the listing
    }

    //--------------------------------------------------------------//
    //---------------------  Chainlink Functions   -----------------//
    //--------------------------------------------------------------//

    /*
     * @notice Method for requesting the current ETH/USD price from Chainlink
     */
    function requestEthPrice() public returns (bytes32 requestId) {
        Chainlink.Request memory req = _buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req._add("get", "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD"); //set the URL to perform GET request
        // set the path to find the desired data in the API
        // {
        //   "RAW": {
        //     "ETH": {
        //       "USD": {
        //         "PRICE": 3799.10197094899
        //       }
        //     }
        //   }
        // }
        req._add("path", "RAW,ETH,USD,PRICE");
        int256 timesAmount = 10 ** 18; // Multiply the result by 1e18 to remove decimals
        req._addInt("times", timesAmount);
        return _sendChainlinkRequest(req, fee); // Sends the request
    }

    /* Receive the response in the form of uint256 */
    /*
     * @notice Callback function for Chainlink price request
     * @param _requestId: Request ID
     * @param _price: ETH price in USD
     */
    function fulfill(bytes32 _requestId, uint256 _ethPriceInUsd) public recordChainlinkFulfillment(_requestId) {
        emit RequestPrice(_requestId, _ethPriceInUsd);
        ethPriceInUsd = _ethPriceInUsd;
    }

    //--------------------------------------------------------------//
    //---------------------  Getter Functions  ---------------------//
    //--------------------------------------------------------------//
    function getOwner() external view returns (address) {return i_owner;}
    function getProceeds(address seller) external view returns (uint256) {return s_proceeds[seller];}
    function getListing(address nftAddress, uint256 tokenId) external view returns (Listing memory) { return s_listings[nftAddress][tokenId];}
    function isNFTListed(address nftAddress, uint256 tokenId) external view returns (bool){
        Listing memory listing = s_listings[nftAddress][tokenId];
        return (listing.price >0);
    }
}
