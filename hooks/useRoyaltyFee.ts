import { useContract, useProvider } from "wagmi";
import { useLooksRareSDK } from "../context/LooksRareSDKProvider";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import IRoyaltyFeeManagerAbi from "@cuonghx.gu-tech/looksrare-sdk/dist/abis/IRoyaltyFeeManager.json"

// TO-DO: support other strategy
export default function (collectionAddress: string, tokenId: string, amount = 1) {
  const sdk = useLooksRareSDK()
  const provider = useProvider()
  
  const [fee, setFee] = useState(0)

  useEffect(() => {
    const getFee = async () => {
      if (!collectionAddress || !tokenId) return
      const royaltyFeeManager = new ethers.Contract(sdk.addresses.ROYALTY_FEE_MANAGER, IRoyaltyFeeManagerAbi, provider)
      const [, fee] = await royaltyFeeManager.calculateRoyaltyFeeAndGetRecipient(collectionAddress, tokenId, amount)
      setFee(fee.toNumber())
    } 
    getFee()
  }, [sdk, provider])

  return fee
}
