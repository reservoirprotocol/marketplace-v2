import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Currency,
  Listings,
  useReservoirClient,
} from '@reservoir0x/reservoir-kit-ui'
import { Execute } from '@reservoir0x/reservoir-sdk'
import { Modal } from 'components/common/Modal'
import TransactionProgress from 'components/common/TransactionProgress'
import ProgressBar from 'components/portfolio/ProgressBar'
import { Box, Button, Flex, Text } from 'components/primitives'
import dayjs from 'dayjs'
import { constants } from 'ethers'
import { parseUnits } from 'ethers/lib/utils.js'
import { UserToken } from 'pages/portfolio'
import { FC, useCallback, useState } from 'react'
import { ExpirationOption } from 'types/ExpirationOption'
import { useSigner } from 'wagmi'

enum BatchListStep {
  Approving,
  Complete,
}

type BatchListModalStepData = {
  totalSteps: number
  stepProgress: number
  currentStep: Execute['steps'][0]
  listings: Listings[0][]
}

type Props = {
  listings: (Listings[0] & { item: UserToken['token'] } & {
    expirationOption: ExpirationOption
  })[]
  disabled: boolean
  currency: Currency
  onCloseComplete?: () => void
}

const BatchList: FC<Props> = ({
  listings,
  disabled,
  currency,
  onCloseComplete,
}) => {
  const [open, setOpen] = useState(false)
  const { data: signer } = useSigner()
  const client = useReservoirClient()
  const [batchListStep, setBatchListStep] = useState<BatchListStep>(
    BatchListStep.Approving
  )
  const [stepData, setStepData] = useState<BatchListModalStepData | null>(null)
  const [transactionError, setTransactionError] = useState<Error | null>()

  const listTokens = useCallback(() => {
    console.log('listing tokens', listings)
    if (!signer) {
      const error = new Error('Missing a signer')
      setTransactionError(error)
      throw error
    }

    if (!client) {
      const error = new Error('ReservoirClient was not initialized')
      setTransactionError(error)
      throw error
    }

    setTransactionError(null)

    const convertedListings: Listings[0][] = []

    listings.forEach((listing) => {
      let expirationTime: string | null = null

      if (
        listing.expirationOption.relativeTime &&
        listing.expirationOption.relativeTimeUnit
      ) {
        expirationTime = dayjs()
          .add(
            listing.expirationOption.relativeTime,
            listing.expirationOption.relativeTimeUnit
          )
          .unix()
          .toString()
      }

      const convertedListing: Listings[0] = {
        token: listing.token,
        weiPrice: parseUnits(`${+listing.weiPrice}`, currency.decimals)
          .mul(1)
          .toString(),
        orderbook: listing.orderbook,
        orderKind: listing.orderKind,
      }

      if (expirationTime) {
        listing.expirationTime = expirationTime
      }

      if (currency && currency.contract != constants.AddressZero) {
        listing.currency = currency.contract
      }

      listing.options = {
        'seaport-v1.4': {
          useOffChainCancellation: true,
        },
      }

      convertedListings.push(convertedListing)
    })

    console.log(convertedListings)

    setBatchListStep(BatchListStep.Approving)

    client.actions
      .listToken({
        listings: convertedListings,
        signer,
        onProgress: (steps: Execute['steps']) => {
          const executableSteps = steps.filter(
            (step) => step.items && step.items.length > 0
          )

          let stepCount = executableSteps.length
          let incompleteStepItemIndex: number | null = null
          let incompleteStepIndex: number | null = null

          executableSteps.find((step, i) => {
            if (!step.items) {
              return false
            }

            incompleteStepItemIndex = step.items.findIndex(
              (item) => item.status == 'incomplete'
            )
            if (incompleteStepItemIndex !== -1) {
              incompleteStepIndex = i
              return true
            }
          })

          if (
            incompleteStepIndex === null ||
            incompleteStepItemIndex === null
          ) {
            const currentStep = executableSteps[executableSteps.length - 1]
            const currentStepItem = currentStep.items
              ? currentStep.items[currentStep.items.length]
              : null
            setBatchListStep(BatchListStep.Complete)
            const listings =
              currentStepItem && currentStepItem.orderIndexes !== undefined
                ? convertedListings.filter((_, i) =>
                    currentStepItem.orderIndexes?.includes(i)
                  )
                : [convertedListings[convertedListings.length - 1]]
            setStepData({
              totalSteps: stepCount,
              stepProgress: stepCount,
              currentStep,
              listings: listings,
            })
          } else {
            const currentStep = executableSteps[incompleteStepIndex]
            const currentStepItem = currentStep.items
              ? currentStep.items[incompleteStepItemIndex]
              : null
            const listings =
              currentStepItem && currentStepItem.orderIndexes !== undefined
                ? convertedListings.filter((_, i) =>
                    currentStepItem.orderIndexes?.includes(i)
                  )
                : [convertedListings[convertedListings.length - 1]]

            setStepData({
              totalSteps: stepCount,
              stepProgress: incompleteStepIndex,
              currentStep: executableSteps[incompleteStepIndex],
              listings: listings,
            })
          }
        },
      })
      .catch((e: any) => {
        const error = e as Error
        const transactionError = new Error(error?.message || '', {
          cause: error,
        })
        setTransactionError(transactionError)
      })
  }, [client, listings, signer])

  const trigger = (
    <Button disabled={disabled} onClick={listTokens}>
      List
    </Button>
  )
  return (
    <Modal
      title="Complete Listings"
      trigger={trigger}
      open={open}
      onOpenChange={(open) => {
        if (
          !open &&
          onCloseComplete &&
          batchListStep === BatchListStep.Complete
        ) {
          onCloseComplete()
        }
        setOpen(open)
      }}
    >
      {batchListStep === BatchListStep.Approving && (
        <Flex
          direction="column"
          css={{ flex: 1, textAlign: 'center', p: '$4', gap: '$4' }}
        >
          <ProgressBar value={1} max={2} />
          {stepData && (
            <>
              <Text
                css={{ textAlign: 'center', mt: 48, mb: 28 }}
                style="subtitle1"
              >
                {/* {stepTitle} */}
              </Text>
              <TransactionProgress
                justify="center"
                fromImg={'['}
                toImgs={['']}
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
                {stepData?.currentStep.description}
              </Text>
            </>
          )}
          {!transactionError ? (
            <Button
              css={{ width: '100%', justifyContent: 'center' }}
              disabled={true}
            >
              Waiting for Approval...
            </Button>
          ) : (
            <Button
              css={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          )}
        </Flex>
      )}
      {batchListStep === BatchListStep.Complete && (
        <Flex
          direction="column"
          align="center"
          justify="center"
          css={{ flex: 1, textAlign: 'center', p: '$4' }}
        >
          <Flex direction="column" css={{ my: 50 }}>
            <Box css={{ color: '$green10', mb: 24 }}>
              <FontAwesomeIcon icon={faCheckCircle} size="2x" />
            </Box>
            <Text style="h5">Your items have been listed!</Text>
          </Flex>
          <Button
            css={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </Flex>
      )}
    </Modal>
  )
}

export default BatchList
