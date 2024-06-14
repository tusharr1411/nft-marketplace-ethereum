import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

import {
  ItemListed as ItemListedEvent,
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ArbiterAdded as ArbiterAddedEvent,
  ArbiterRemoved as ArbiterRemovedEvent,
  DisputeRaised as DisputeRaisedEvent,
  ChainlinkCancelled as ChainlinkCancelledEvent,
  ChainlinkFulfilled as ChainlinkFulfilledEvent,
  ChainlinkRequested as ChainlinkRequestedEvent,
  RequestPrice as RequestPriceEvent

} from "../generated/NftMarketPlace/NftMarketPlace"


import {
  ActiveItem,
  ItemListed,
  ItemBought,
  ItemCanceled,
  ArbiterAdded,
  ArbiterRemoved,
  DisputeRaised,
  ChainlinkCancelled,
  ChainlinkFulfilled,
  ChainlinkRequested,
  RequestPrice
} from "../generated/schema"



export function handleItemListed(event: ItemListedEvent): void {
  //grab the item row from ActiveItem and ListedItem tables against the ItemListedEvent's ID( If exists)
  let itemListed = ItemListed.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));

  //If not then create new entities in tables
  if (!itemListed) {
      itemListed = new ItemListed(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  }
  if (!activeItem) {
      activeItem = new ActiveItem(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  }


  itemListed.seller = event.params.seller;
  itemListed.nftAddress = event.params.nftAddress;
  itemListed.tokenId = event.params.tokenId;
  itemListed.price = event.params.price;
  itemListed.arbiter = event.params.arbiter;
  itemListed.disputed = event.params.disputed;
  itemListed.arbiterSetTimestamp = event.params.arbiterSetTimestamp;
  itemListed.blockNumber = event.block.number;
  itemListed.blockTimestamp = event.block.timestamp;
  itemListed.transactionHash = event.transaction.hash;

  activeItem.buyer = Address.fromString("0x0000000000000000000000000000000000000000");
  activeItem.seller = event.params.seller;
  activeItem.nftAddress = event.params.nftAddress;
  activeItem.tokenId = event.params.tokenId;
  activeItem.price = event.params.price;
  activeItem.arbiter = event.params.arbiter;
  activeItem.disputed = event.params.disputed;
  activeItem.arbiterSetTimestamp = event.params.arbiterSetTimestamp;

  itemListed.save();
  activeItem.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));


  if (!itemCanceled) {
      itemCanceled = new ItemCanceled(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  }

  itemCanceled.seller = event.params.seller;
  itemCanceled.nftAddress = event.params.nftAddress;
  itemCanceled.tokenId = event.params.tokenId;
  itemCanceled.blockNumber = event.block.number;
  itemCanceled.blockTimestamp = event.block.timestamp;
  itemCanceled.transactionHash = event.transaction.hash;

  activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD");

  itemCanceled.save();
  activeItem!.save();
}

export function handleItemBought(event: ItemBoughtEvent): void {
  // save that event in our graph
  // update out active items
  // get or create an itemListed object
  // each item needs a unique ID
  let itemBought = ItemBought.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));

  if (!itemBought) {
      itemBought = new ItemBought(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  }

  itemBought.buyer = event.params.buyer;
  itemBought.nftAddress = event.params.nftAddress;
  itemBought.tokenId = event.params.tokenId;
  itemBought.price = event.params.price;
  itemBought.blockNumber = event.block.number;
  itemBought.blockTimestamp = event.block.timestamp;
  itemBought.transactionHash = event.transaction.hash;

  activeItem!.buyer = event.params.buyer;

  itemBought.save();
  activeItem!.save();
}


export function handleArbiterAdded(event: ArbiterAddedEvent): void {
  let arbiterAdded = ArbiterAdded.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));

  if(!arbiterAdded) {
    arbiterAdded = new ArbiterAdded(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  }

  arbiterAdded.arbiter = event.params.arbiter;
  arbiterAdded.nftAddress = event.params.nftAddress;
  arbiterAdded.tokenId = event.params.tokenId;
  arbiterAdded.arbiterSetTimestamp = event.params.arbiterSetTimestamp;
  arbiterAdded.blockNumber = event.block.number;
  arbiterAdded.blockTimestamp = event.block.timestamp;
  arbiterAdded.transactionHash = event.transaction.hash;


  activeItem!.arbiter = event.params.arbiter;
  activeItem!.arbiterSetTimestamp = event.params.arbiterSetTimestamp;

  arbiterAdded.save();
  activeItem!.save();
}

export function handleDisputeRaised(event: DisputeRaisedEvent): void {
  let disputeRaised = DisputeRaised.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));

  if(!disputeRaised) {
    disputeRaised = new DisputeRaised(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  }


  disputeRaised.arbiter = event.params.arbiter
  disputeRaised.nftAddress = event.params.nftAddress
  disputeRaised.tokenId = event.params.tokenId
  disputeRaised.blockNumber = event.block.number
  disputeRaised.blockTimestamp = event.block.timestamp
  disputeRaised.transactionHash = event.transaction.hash

  activeItem!.disputed = true; 

  disputeRaised.save()
  activeItem!.save();
}


export function handleArbiterRemoved(event: ArbiterRemovedEvent): void {
  let arbiterRemoved =  ArbiterRemoved.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));


  if (!arbiterRemoved) {
    arbiterRemoved = new ArbiterRemoved(getIdFromEventParams(event.params.tokenId, event.params.nftAddress));
  }
  arbiterRemoved.nftAddress = event.params.nftAddress;
  arbiterRemoved.tokenId = event.params.tokenId;
  arbiterRemoved.blockNumber = event.block.number;
  arbiterRemoved.blockTimestamp = event.block.timestamp;
  arbiterRemoved.transactionHash = event.transaction.hash;

  activeItem!.arbiter = Address.fromString("0x0000000000000000000000000000000000000000");
  activeItem!.arbiterSetTimestamp = BigInt.zero(); // Setting arbiterSetTimestamp to zero


  arbiterRemoved.save();
  activeItem!.save();
}

















function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}



export function handleChainlinkCancelled(event: ChainlinkCancelledEvent): void {
  let entity = new ChainlinkCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.NftMarketPlace_id = event.params.id
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}



export function handleChainlinkFulfilled(event: ChainlinkFulfilledEvent): void {
  let entity = new ChainlinkFulfilled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.NftMarketPlace_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}



export function handleChainlinkRequested(event: ChainlinkRequestedEvent): void {
  let entity = new ChainlinkRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.NftMarketPlace_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}


export function handleRequestPrice(event: RequestPriceEvent): void {
  let entity = new RequestPrice(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId
  entity.ethPriceInUsd = event.params.ethPriceInUsd

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
