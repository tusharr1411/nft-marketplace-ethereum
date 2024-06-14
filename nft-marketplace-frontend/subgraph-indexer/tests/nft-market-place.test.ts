import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { ArbiterAdded } from "../generated/schema"
import { ArbiterAdded as ArbiterAddedEvent } from "../generated/NftMarketPlace/NftMarketPlace"
import { handleArbiterAdded } from "../src/nft-market-place"
import { createArbiterAddedEvent } from "./nft-market-place-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let arbiter = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let nftAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tokenId = BigInt.fromI32(234)
    let arbiterSetTimestamp = BigInt.fromI32(234)
    let newArbiterAddedEvent = createArbiterAddedEvent(
      arbiter,
      nftAddress,
      tokenId,
      arbiterSetTimestamp
    )
    handleArbiterAdded(newArbiterAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ArbiterAdded created and stored", () => {
    assert.entityCount("ArbiterAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ArbiterAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "arbiter",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ArbiterAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "nftAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ArbiterAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
    assert.fieldEquals(
      "ArbiterAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "arbiterSetTimestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
