import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react'

import {
  Flex,
  Box,
  Text,
  Button,
  Loader,
  Select,
  ErrorWell,
  CryptoCurrencyIcon,
} from 'components/primitives'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from '../Modal/Modal'
import {
  ListingData,
  ListModalRenderer,
  ListingStep,
} from './ListModalRenderer'
import { ModalSize } from '../Modal/Modal'
import { faChevronLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import TokenStats from './TokenStats'
import TokenListingDetails from './TokenListingDetails'
import useFallbackState from '../hooks/useFallbackState'
import TransactionProgress from '../Modal/TransactionProgress'
import ProgressBar from '../Modal/ProgressBar'
import InfoTooltip from 'components/primitives/InfoTooltip'
import { constants } from 'ethers'
import { styled } from 'stitches.config'
import { Currency } from 'types/currency'
import MarketplacePriceInput from './MarketplacePriceInput'
import { marketplaceInfo } from 'constants/common'

type Props = Pick<Parameters<typeof Modal>['0'], 'trigger'> & {
  openState?: [boolean, Dispatch<SetStateAction<boolean>>]
  tokenId?: string
  collectionId?: string
  onListingError?: (error: Error) => void
}

const Image = styled('img', {})
const Span = styled('span', {})
const ContentContainer = styled(Flex, {
  width: '100%',
  flexDirection: 'column',
  '@bp600': {
    flexDirection: 'row',
  },
})

const MainContainer = styled(Flex, {
  flex: 1,
  borderColor: '$borderColor',
  borderTopWidth: 1,
  borderLeftWidth: 0,
  '@bp600': {
    borderTopWidth: 0,
    borderLeftWidth: 1,
  },

  defaultVariants: {
    direction: 'column',
  },
})

export function ListModal({
  openState,
  trigger,
  tokenId,
  collectionId,
  onListingError,
}: Props): ReactElement {
  const [open, setOpen] = useFallbackState(
    openState ? openState[0] : false,
    openState
  )

  return (
    <ListModalRenderer
      open={open}
      tokenId={tokenId}
      collectionId={collectionId}
    >
      {({
        token,
        collection,
        listingStep,
        expirationOption,
        expirationOptions,
        transactionError,
        setListingStep,
        listToken,
        setExpirationOption,
        price,
        setPrice,
        currencyOptions,
        currencyOption,
        setCurrencyOption,
        loading,
        protocolFee,
        royaltyFee,
        listingData,
        requestUserStep
      }) => {
        const tokenImage =
          token && token?.image
            ? token.image
            : (collection?.image as string)

        useEffect(() => {
          if (transactionError && onListingError) {
            onListingError(transactionError)
          }
        }, [transactionError])


        return (
          <Modal
            trigger={trigger}
            size={ModalSize.LG}
            title="List Item for sale"
            open={open}
            onOpenChange={(open) => {
              setOpen(open)
            }}
            loading={loading}
          >
            {!loading && listingStep == ListingStep.SelectMarkets && (
              <ContentContainer>
                <TokenStats
                  token={token}
                  collection={collection}
                  royaltyFee={royaltyFee}
                />

                <MainContainer>
                  <Box css={{ p: '$4', flex: 1 }}>
                    <Text style="subtitle2" as="p" color="subtle">
                      Default
                    </Text>
                    <Flex align="center" css={{ mb: '$4', mt: '$2' }}>
                      <Box css={{ mr: '$2' }}>
                        <img
                          src={marketplaceInfo.imageUrl}
                          style={{
                            height: 32,
                            width: 32,
                            borderRadius: 4,
                            visibility: 'visible'
                          }}
                        />
                      </Box>
                      <Box css={{ mr: '$2', flex: 1 }}>
                        <Text style="body2">{marketplaceInfo.name}</Text>
                        <Flex css={{ alignItems: 'center', gap: 8 }}>
                          <Text style="body2" color="subtle" as="div">
                            on Marketplace
                          </Text>
                          <InfoTooltip
                            side="bottom"
                            width={200}
                            content={
                              'Listings made on this marketplace will be distributed across the reservoir ecosystem'
                            }
                          />
                        </Flex>
                      </Box>
                      <Text style="subtitle2" color="subtle" css={{ mr: '$2' }}>
                        Marketplace fee:{' '}
                        {(protocolFee / 10000) * 100}%
                      </Text>
                    </Flex>
                  </Box>
                  <Box css={{ p: '$4', width: '100%' }}>
                    <Button
                      onClick={() => setListingStep(ListingStep.SetPrice)}
                      css={{ width: '100%', display: 'inline'}}
                    >
                      Set your price
                    </Button>
                  </Box>
                </MainContainer>
              </ContentContainer>
            )}
            {!loading && listingStep == ListingStep.SetPrice && (
              <ContentContainer>
                <TokenStats
                  token={token}
                  collection={collection}
                  royaltyFee={royaltyFee}
                />

                <MainContainer>
                  <Box css={{ p: '$4', flex: 1 }}>
                    <Flex align="center" css={{ mb: '$4' }}>
                      <Button
                        color="ghost"
                        size="medium"
                        css={{ mr: '$2', color: '$neutralText' }}
                        onClick={() => setListingStep(ListingStep.SelectMarkets)}
                      >
                        <FontAwesomeIcon
                          icon={faChevronLeft}
                          width={16}
                          height={16}
                        />
                      </Button>
                      <Text style="subtitle1" as="h3">
                        Set Your Price
                      </Text>
                    </Flex>
                    <Flex css={{ mb: '$2' }} justify="between">
                      <Text style="subtitle2" color="subtle" as="p">
                        Price
                      </Text>
                      <Flex css={{ alignItems: 'center', gap: 8 }}>
                        <Text style="subtitle2" color="subtle" as="p">
                          Profit
                        </Text>
                        <InfoTooltip
                          side="left"
                          width={200}
                          content={`How much ${currencyOption.symbol} you will receive after marketplace fees and creator royalties are subtracted.`}
                        />
                      </Flex>
                    </Flex>

                    <Box css={{ mb: '$3' }}>
                      <MarketplacePriceInput
                        price={price}
                        collection={collection}
                        currency={currencyOption}
                        quantity={1}
                        onChange={(e) => {
                          setPrice(e.target.value)
                        }}
                      />
                    </Box>

                    <Box css={{ mb: '$3', mt: '$4' }}>
                      <Text
                        as="div"
                        css={{ mb: '$2' }}
                        style="subtitle2"
                        color="subtle"
                      >
                        Currency
                      </Text>
                      <Select
                        value={currencyOption?.symbol || ''}
                        onValueChange={(value: string) => {
                          const option = currencyOptions.find(
                            (option) => option.contract == value
                          )
                          if (option) {
                            setCurrencyOption(option)
                          }
                        }}
                      >
                        {currencyOptions.map((option) => (
                          <Select.Item key={option.contract} value={option.contract}>
                            <Select.ItemText>{option.symbol}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select>
                    </Box>

                    <Box css={{ mb: '$3', mt: '$4' }}>
                      <Text
                        as="div"
                        css={{ mb: '$2' }}
                        style="subtitle2"
                        color="subtle"
                      >
                        Expiration Date
                      </Text>
                      <Select
                        value={expirationOption?.text || ''}
                        onValueChange={(value: string) => {
                          const option = expirationOptions.find(
                            (option) => option.value == value
                          )
                          if (option) {
                            setExpirationOption(option)
                          }
                        }}
                      >
                        {expirationOptions.map((option) => (
                          <Select.Item key={option.text} value={option.value}>
                            <Select.ItemText>{option.text}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select>
                    </Box>
                    

                  </Box>
                  <Box css={{ p: '$4', width: '100%' }}>
                    <Button
                      disabled={+price === 0}
                      onClick={listToken}
                      css={{ width: '100%', display: "inline" }}
                    >
                      List for sale
                    </Button>
                  </Box>
                </MainContainer>
              </ContentContainer>
            )}
            {!loading && listingStep == ListingStep.ListItem && (
              <ContentContainer>
                <TokenListingDetails
                  token={token}
                  collection={collection}
                  listingData={listingData}
                  currency={currencyOption}
                />
                <MainContainer css={{ p: '$4' }}>
                  {transactionError && <ErrorWell css={{ mt: 24 }} />}
                  <ProgressBar
                    value={requestUserStep === "APPROVAL" ? 1 : 2}
                    max={2}
                  />
                    <>
                      <Text
                        css={{ textAlign: 'center', mt: 48, mb: 28 }}
                        style="subtitle1"
                      >
                        {requestUserStep === "APPROVAL"
                          ? 'Approve access to items\nin your wallet'
                          : 'Confirm listing in your wallet'}
                      </Text>
                      <TransactionProgress
                        justify="center"
                        fromImg={tokenImage}
                      />
                      <Text
                        css={{
                          textAlign: 'center',
                          mt: 24,
                          maxWidth: 395,
                          mx: 'auto',
                          mb: '$4',
                        }}
                        style="body2"
                        color="subtle"
                      >
                        A free off-chain signature to create the listing
                      </Text>
                    </>
                    <Flex
                      css={{ height: '100%' }}
                      justify="center"
                      align="center"
                    >
                      <Loader />
                    </Flex>
                  {!transactionError && (
                    <Button css={{ width: '100%', mt: 'auto', justifyContent: "center" }} disabled={true}>
                      <Loader />
                      Waiting for Approval
                    </Button>
                  )}
                  {transactionError && (
                    <Flex css={{ mt: 'auto', gap: 10 }}>
                      <Button
                        color="gray3"
                        css={{ flex: 1, display: "inline" }}
                        onClick={() => setListingStep(ListingStep.SetPrice)}
                      >
                        Edit Listing
                      </Button>
                      <Button css={{ flex: 1, display: "inline"  }} onClick={() => listToken()}>
                        Retry
                      </Button>
                    </Flex>
                  )}
                </MainContainer>
              </ContentContainer>
            )}
            {!loading && listingStep == ListingStep.Complete && (
              <ContentContainer>
                <TokenListingDetails
                  token={token}
                  collection={collection}
                  listingData={listingData}
                  currency={currencyOption}
                />
                <MainContainer css={{ p: '$4' }}>
                  <ProgressBar
                    value={requestUserStep === "APPROVAL" ? 1 : 2}
                    max={2}
                  />
                  <Flex
                    align="center"
                    justify="center"
                    direction="column"
                    css={{ flex: 1, textAlign: 'center', py: '$5' }}
                  >
                    <Box css={{ color: '$successAccent', mb: 24 }}>
                      <FontAwesomeIcon icon={faCheckCircle} size="3x" />
                    </Box>
                    <Text style="h5" css={{ mb: '$2' }} as="h5">
                      Your item has been listed!
                    </Text>
                    <Text
                      style="body2"
                      color="subtle"
                      as="p"
                      css={{ mb: 24, maxWidth: 300, overflow: 'hidden' }}
                    >
                      <Text color="subtle" ellipsify style="body2">
                        {token?.name
                          ? token?.name
                          : `#${token?.tokenID}`}
                      </Text>{' '}
                      from{' '}
                      <Span css={{ color: '$accentText' }}>
                        {token?.collection?.name}
                      </Span>{' '}
                      has been listed for sale
                    </Text>
                    <Text style="subtitle2" as="p" css={{ mb: '$3' }}>
                      View Listing on
                    </Text>
                    <Flex css={{ gap: '$3' }}>
                      <a
                        target="_blank"
                        href={`${process.env.NEXT_PUBLIC_BASE_URL}/collection/${token?.collection?.id}/${token?.tokenID}`}
                      >
                        <Image
                          css={{ width: 24 }}
                          src={marketplaceInfo.imageUrl}
                        />
                      </a>
                    </Flex>
                  </Flex>

                  <Flex
                    css={{
                      flexDirection: 'column',
                      gap: '$3',
                      '@bp600': {
                        flexDirection: 'row',
                      },
                    }}
                  >
                    <Button
                        onClick={() => {
                          setOpen(false)
                        }}
                        style={{ flex: 1, display: 'inline' }}
                        color="primary"
                      >
                        Close
                      </Button>
                  </Flex>
                </MainContainer>
              </ContentContainer>
            )}
          </Modal>
        )
      }}
    </ListModalRenderer>
  )
}

ListModal.Custom = ListModalRenderer
