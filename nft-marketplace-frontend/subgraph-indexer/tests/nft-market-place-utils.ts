import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  ArbiterAdded,
  ArbiterRemoved,
  ChainlinkCancelled,
  ChainlinkFulfilled,
  ChainlinkRequested,
  DisputeRaised,
  ItemBought,
  ItemCanceled,
  ItemListed,
  RequestPrice
} from "../generated/NftMarketPlace/NftMarketPlace"

export function createArbiterAddedEvent(
  arbiter: Address,
  nftAddress: Address,
  tokenId: BigInt,
  arbiterSetTimestamp: BigInt
): ArbiterAdded {
  let arbiterAddedEvent = changetype<ArbiterAdded>(newMockEvent())

  arbiterAddedEvent.parameters = new Array()

  arbiterAddedEvent.parameters.push(
    new ethereum.EventParam("arbiter", ethereum.Value.fromAddress(arbiter))
  )
  arbiterAddedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  arbiterAddedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  arbiterAddedEvent.parameters.push(
    new ethereum.EventParam(
      "arbiterSetTimestamp",
      ethereum.Value.fromUnsignedBigInt(arbiterSetTimestamp)
    )
  )

  return arbiterAddedEvent
}

export function createArbiterRemovedEvent(
  nftAddress: Address,
  tokenId: BigInt
): ArbiterRemoved {
  let arbiterRemovedEvent = changetype<ArbiterRemoved>(newMockEvent())

  arbiterRemovedEvent.parameters = new Array()

  arbiterRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  arbiterRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return arbiterRemovedEvent
}

export function createChainlinkCancelledEvent(id: Bytes): ChainlinkCancelled {
  let chainlinkCancelledEvent = changetype<ChainlinkCancelled>(newMockEvent())

  chainlinkCancelledEvent.parameters = new Array()

  chainlinkCancelledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return chainlinkCancelledEvent
}

export function createChainlinkFulfilledEvent(id: Bytes): ChainlinkFulfilled {
  let chainlinkFulfilledEvent = changetype<ChainlinkFulfilled>(newMockEvent())

  chainlinkFulfilledEvent.parameters = new Array()

  chainlinkFulfilledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return chainlinkFulfilledEvent
}

export function createChainlinkRequestedEvent(id: Bytes): ChainlinkRequested {
  let chainlinkRequestedEvent = changetype<ChainlinkRequested>(newMockEvent())

  chainlinkRequestedEvent.parameters = new Array()

  chainlinkRequestedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return chainlinkRequestedEvent
}

export function createDisputeRaisedEvent(
  arbiter: Address,
  nftAddress: Address,
  tokenId: BigInt
): DisputeRaised {
  let disputeRaisedEvent = changetype<DisputeRaised>(newMockEvent())

  disputeRaisedEvent.parameters = new Array()

  disputeRaisedEvent.parameters.push(
    new ethereum.EventParam("arbiter", ethereum.Value.fromAddress(arbiter))
  )
  disputeRaisedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  disputeRaisedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return disputeRaisedEvent
}

export function createItemBoughtEvent(
  buyer: Address,
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt
): ItemBought {
  let itemBoughtEvent = changetype<ItemBought>(newMockEvent())

  itemBoughtEvent.parameters = new Array()

  itemBoughtEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return itemBoughtEvent
}

export function createItemCanceledEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt
): ItemCanceled {
  let itemCanceledEvent = changetype<ItemCanceled>(newMockEvent())

  itemCanceledEvent.parameters = new Array()

  itemCanceledEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  itemCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  itemCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return itemCanceledEvent
}

export function createItemListedEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt,
  arbiter: Address,
  disputed: boolean,
  arbiterSetTimestamp: BigInt
): ItemListed {
  let itemListedEvent = changetype<ItemListed>(newMockEvent())

  itemListedEvent.parameters = new Array()

  itemListedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam("arbiter", ethereum.Value.fromAddress(arbiter))
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam("disputed", ethereum.Value.fromBoolean(disputed))
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      "arbiterSetTimestamp",
      ethereum.Value.fromUnsignedBigInt(arbiterSetTimestamp)
    )
  )

  return itemListedEvent
}

export function createRequestPriceEvent(
  requestId: Bytes,
  ethPriceInUsd: BigInt
): RequestPrice {
  let requestPriceEvent = changetype<RequestPrice>(newMockEvent())

  requestPriceEvent.parameters = new Array()

  requestPriceEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  requestPriceEvent.parameters.push(
    new ethereum.EventParam(
      "ethPriceInUsd",
      ethereum.Value.fromUnsignedBigInt(ethPriceInUsd)
    )
  )

  return requestPriceEvent
}
