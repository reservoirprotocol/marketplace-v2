import React, {
  FC,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react'

import { useAccount, useSigner } from 'wagmi'

import dayjs from 'dayjs'
import { ExpirationOption } from 'types/ExpirationOption'
import expirationOptions from '../lib/defaultExpirationOptions'
import currencyOptions from '../lib/defaultCurrencyOptions'

import { Collection, Marketplace, Token } from 'types/workaround'
import { Currency } from 'types/currency'
import { gql } from '__generated__'
import { useMutation, useQuery } from '@apollo/client'
import { useNft } from 'use-nft'
import { useRoyaltyFee, useStrategyFee  } from 'hooks'
import { useLooksRareSDK } from 'context/LooksRareSDKProvider'
import { MakerOrder } from "@cuonghx.gu-tech/looksrare-sdk"
import { CREATE_ORDER } from 'graphql/queries/orders'
import { parseUnits } from 'ethers/lib/utils.js'
import { GET_NONCE, GET_TOKEN_BY_ID } from 'graphql/queries/tokens'

export type ListingData = MakerOrder | null

export enum ListingStep {
  SelectMarkets,
  SetPrice,
  ListItem,
  Complete,
}

type ChildrenProps = {
  token?: Token
  collection?: Collection
  // listingStep
  listingStep: ListingStep
  setListingStep: React.Dispatch<React.SetStateAction<ListingStep>>
  // expirationOptions
  expirationOptions: ExpirationOption[]
  setExpirationOption: React.Dispatch<React.SetStateAction<ExpirationOption>>
  expirationOption: ExpirationOption
  listingData: ListingData
  transactionError?: Error | null
  listToken: () => void
  // price
  price: string
  setPrice: (price: string) => void
  // currency options
  currencyOptions: Currency[]
  currencyOption: Currency
  setCurrencyOption: (currency: Currency) => void
  loading: boolean,
  royaltyFee: number,
  protocolFee: number,
  requestUserStep: "APPROVAL" | "SIGN"
}

type Props = {
  open: boolean
  tokenId?: string
  collectionId?: string
  children: (props: ChildrenProps) => ReactNode
}

export const ListModalRenderer: FC<Props> = ({
  open,
  tokenId,
  collectionId,
  children,
}) => {
  const looksRareSdk = useLooksRareSDK()
  const account = useAccount()
  const [listingStep, setListingStep] = useState<ListingStep>(ListingStep.SelectMarkets)
  const [listingData, setListingData] = useState<ListingData>(null)
  const [transactionError, setTransactionError] = useState<Error | null>()
  const [price, setPrice] = useState<string>('0')
  const [expirationOption, setExpirationOption] = useState<ExpirationOption>(
    expirationOptions[5] // a month
  )
  const [currencyOption, setCurrencyOption] = useState<Currency>(
    currencyOptions[0]
  )
  // TO-DO: strategyOptions
  const strategy = looksRareSdk.addresses.STRATEGY_STANDARD_SALE_DEPRECATED;
  const [createOrderMutation] = useMutation(CREATE_ORDER);

  const [requestUserStep, setRequestUserStep] = useState<"APPROVAL" | "SIGN">("APPROVAL")

  const { data: dataNonce } = useQuery(GET_NONCE, {
    variables: { signer: account.address as string },
  })
  const nonce = dataNonce?.nonce?.nonce

  useEffect(() => {
    if (!open) {
      setListingStep(ListingStep.SelectMarkets)
      setTransactionError(null)
      setExpirationOption(expirationOptions[5])
      setListingData(null)
      setPrice("0")
    }
    
    setCurrencyOption(currencyOptions[0])
  }, [open])

  const listToken = useCallback(async () => {
    try {
      if (!collectionId) {
        const error = new Error('Missing collection id')
        setTransactionError(error)
        throw error
      }

      if (!tokenId) {
        const error = new Error('Missing collection id')
        setTransactionError(error)
        throw error
      }

      const expirationTime = dayjs()
      .add(expirationOption.relativeTime, expirationOption.relativeTimeUnit)
      .unix()
      
      setListingStep(ListingStep.ListItem)
  
      const { maker, isCollectionApproved } = await looksRareSdk.createMakerAsk({
        collection: collectionId,
        price: parseUnits(`${price}`, currencyOption?.decimals).toString(),
        tokenId,
        amount: 1,
        strategy,
        currency: currencyOption.contract,
        nonce: nonce || 0,
        startTime: dayjs().unix(),
        endTime: expirationTime,
        minPercentageToAsk: 0, // TO-DO: update later
        params: []
      })
      
      setListingData(maker)
  
      if (!isCollectionApproved) {
        await looksRareSdk.approveAllCollectionItems(collectionId, true)
      }
  
      setRequestUserStep("SIGN")
      const signature = await looksRareSdk.signMakerOrder(maker)

      await createOrderMutation({ variables: { createOrderInput: {
        collectionAddress: maker.collection,
        price: maker.price.toString(),
        tokenId: maker.tokenId.toString(),
        amount: Number(maker.amount),
        strategy: maker.strategy,
        currencyAddress: maker.currency,
        nonce: maker.nonce.toString(),
        startTime: Number(maker.startTime),
        endTime: Number(maker.endTime),
        minPercentageToAsk: Number(maker.minPercentageToAsk),
        params: maker.params.toString(),
        signer: maker.signer,
        signature: signature,
        isOrderAsk: maker.isOrderAsk
      }}})

      setListingStep(ListingStep.Complete)
    } catch (error: any) {
      setTransactionError(error)
    }
  
  }, [
    collectionId,
    tokenId,
    expirationOption,
    currencyOption,
    price,
    strategy,
    nonce
  ])


  const { data: tokenData, loading } = useQuery(GET_TOKEN_BY_ID, {
    variables: { id: `${collectionId}-${tokenId}`}
  })
  // TO-DO: remove later, should using token.image
  const { nft } = useNft(tokenData?.token?.collection?.id as string, tokenData?.token?.tokenID)
  const token = {...tokenData?.token, image: nft?.image} as Token
  const collection = tokenData?.token?.collection
  

  const protocolFee = useStrategyFee(strategy)
  const royaltyFee = useRoyaltyFee(token?.collection?.id as string, token?.tokenID)

  return <>{children({
    token,
    collection,
    listingStep,
    setListingStep,
    expirationOption,
    expirationOptions,
    setExpirationOption,
    listToken,
    price,
    setPrice,
    currencyOptions,
    currencyOption,
    setCurrencyOption,
    loading,
    protocolFee,
    royaltyFee,
    listingData,
    transactionError,
    requestUserStep
})}</>
}

ListModalRenderer.displayName = 'ListModalRenderer'
