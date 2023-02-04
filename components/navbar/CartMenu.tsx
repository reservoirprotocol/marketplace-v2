import {styled, keyframes} from '@stitches/react'
import * as Popover from '@radix-ui/react-popover'
import {FC, useContext, useState} from 'react'
import {faShoppingCart, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {useRecoilState, useRecoilValue} from 'recoil'
import {Execute} from '@nftearth/reservoir-sdk'
import {Signer} from 'ethers'
import {useAccount, useBalance, useSigner} from 'wagmi'
import {useReservoirClient} from '@nftearth/reservoir-kit-ui'
import cartTokensAtom, {
  getCartCount,
  getCartCurrency,
  getCartTotalPrice,
  getPricingPools,
} from 'recoil/cart'
import FormatCrypto from 'components/primitives/FormatCryptoCurrency'
import {getPricing} from 'utils/tokenPricing'
import {formatEther} from 'ethers/lib/utils'
import {ToastContext} from "../../context/ToastContextProvider";
import {Box, Button, Flex, FormatCryptoCurrency} from "../primitives";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

type UseBalanceToken = NonNullable<Parameters<typeof useBalance>['0']>['token']

const slideDown = keyframes({
  '0%': {opacity: 0, transform: 'translateY(-10px)'},
  '100%': {opacity: 1, transform: 'translateY(0)'},
})

const slideUp = keyframes({
  '0%': {opacity: 0, transform: 'translateY(10px)'},
  '100%': {opacity: 1, transform: 'translateY(0)'},
})

const StyledContent = styled(Popover.Content, {
  animationDuration: '0.6s',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  animationFillMode: 'forwards',
  '&[data-side="top"]': {animationName: slideUp},
  '&[data-side="bottom"]': {animationName: slideDown},
})

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || 1;

const CartMenu: FC = () => {
  const {addToast} = useContext(ToastContext);
  const cartCount = useRecoilValue(getCartCount)
  const cartTotal = useRecoilValue(getCartTotalPrice)
  const cartCurrency = useRecoilValue(getCartCurrency)
  const pricingPools = useRecoilValue(getPricingPools)
  const [cartTokens, setCartTokens] = useRecoilState(cartTokensAtom)
  const [_open, setOpen] = useState(false)
  const [_steps, setSteps] = useState<Execute['steps']>()
  const [waitingTx, setWaitingTx] = useState<boolean>(false)
  const {data: signer} = useSigner()
  const {address} = useAccount()
  const reservoirClient = useReservoirClient()
  const {data: balance} = useBalance({
    chainId: +CHAIN_ID,
    address: address,
    token:
      cartCurrency?.symbol !== 'ETH'
        ? (cartCurrency?.contract as UseBalanceToken)
        : undefined,
  })

  const execute = async (signer: Signer) => {
    setWaitingTx(true)

    if (!signer) {
      throw 'Missing a signer'
    }

    if (cartTokens.length === 0) {
      throw 'Missing tokens to purchase'
    }

    if (!reservoirClient) throw 'Client not started'

    await reservoirClient.actions
      .buyToken({
        expectedPrice: cartTotal,
        tokens: cartTokens.map((token) => token.token),
        signer,
        onProgress: setSteps,
        options: {
          partial: true,
        },
      })
      .then(() => setCartTokens([]))
      .catch((err: any) => {
        if (err?.type === 'price mismatch') {
          addToast?.({
            title: 'Could not buy token',
            description: 'Price was greater than expected.',
          })
          return
        }

        if (err?.message.includes('ETH balance')) {
          addToast?.({
            title: 'Not enough ETH balance',
            description: 'You have insufficient funds to buy this token.',
          })
          return
        }
        // Handle user rejection
        if (err?.code === 4001) {
          setOpen(false)
          setSteps(undefined)
          addToast?.({
            title: 'User canceled transaction',
            description: 'You have                                                                                                                    ` canceled the transaction.',
          })
          return
        }
        addToast?.({
          title: 'Could not buy token',
          description: 'The transaction was not completed.',
        })
      })

    setWaitingTx(false)
  }

  return (
    <Popover.Root>
      <Popover.Trigger >
        <Flex
          align="center"
          justify="center"
          css={{
            background: '$gray3',
            width: '44px',
            height: '44px',
            borderRadius: 8,
            position: 'relative'
          }}>
          {cartCount > 0 && (
            <Flex
              className="reservoir-subtitle"
              align="center"
              justify="center"
              css={{
                position: 'absolute',
                top: -3,
                right: -3,
                background: '$primary7',
                fontSize: 12,
                padding: '2px 7px',
                borderRadius: '50%'
              }}>
              {cartCount}
            </Flex>
          )}
          <FontAwesomeIcon icon={faShoppingCart} className="h-[18px] w-[18px]"/>
        </Flex>
      </Popover.Trigger>
      <StyledContent
        sideOffset={30}
        style={{
          zIndex: 10000000,
          width: 367,
          background: 'hsla(85,100%,22%,0.9)',
          boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.5)',
          borderRadius: 8,
          padding: 20,
          marginRight: 10
        }}
      >
        <Flex justify="between" css={{mb: '$2'}}>
          <Flex align="center">
            <div className="reservoir-h6" style={{ marginRight: '3rem', fontWeight: 'bold' }}>My Cart</div>
            <Flex className="reservoir-subtitle"
                  align="center"
                  justify="center"
                  css={{
                    height: '$5',
                    width: '$5',
                    borderRadius: 8,
                    background: '$primary7',
                    padding: 5,
                    fontWeight: 'bold'
                  }}>
              {cartCount}
            </Flex>
          </Flex>
          {cartCount > 0 && (
            <Button
              onClick={() => setCartTokens([])}
            >
              Clear
            </Button>
          )}
        </Flex>
        <Box css={{ gap: '$2', overflow: 'auto', maxHeight: 300, display: 'grid', mb: '$6' }}>
          {cartTokens.map((tokenData, index) => {
            const {token} = tokenData
            const {collection, contract, name, image, tokenId} = token
            const price = getPricing(pricingPools, tokenData)

            return (
              <Flex
                key={`${contract}:${tokenId}`}
                justify="between"
              >
                <Flex align="center" css={{ gap: '$2' }}>
                  <Box css={{ height: 60, width: 60, overflow: 'hidden', borderRadius: 8 }}>
                    <img src={image || collection?.image} alt=""/>
                  </Box>
                  <div>
                    <div>
                      {name || `#${tokenId}`}
                    </div>
                    <div>{collection?.name}</div>
                    <div className="reservoir-h6">
                      <FormatCrypto
                        amount={price?.amount?.decimal}
                        address={price?.currency?.contract}
                        decimals={price?.currency?.decimals}
                        logoHeight={18}
                        textStyle={'h6'}
                        maximumFractionDigits={4}
                      />
                    </div>
                  </div>
                </Flex>
                <Button
                  onClick={() => {
                    const newCartTokens = [...cartTokens]
                    newCartTokens.splice(index, 1)
                    setCartTokens(newCartTokens)
                  }}
                  size="xs"
                  corners="circle"

                >
                  <FontAwesomeIcon icon={faTrashAlt}/>
                </Button>
              </Flex>
            )
          })}
        </Box>

        <Flex justify="between" css={{ mb: '$4' }}>
          <div className="reservoir-h6" style={{ fontWeight: 'bold' }}>You Pay</div>
          <div className="reservoir-h6">
            <FormatCryptoCurrency
              amount={cartTotal}
              address={cartCurrency?.contract}
              decimals={cartCurrency?.decimals}
              logoHeight={18}
              textStyle={'h6'}
              maximumFractionDigits={4}
            />
          </div>
        </Flex>
        {balance?.formatted && +balance.formatted < cartTotal && (
          <Box css={{ textAlign: 'center', mb: '$2' }}>
            <span className="reservoir-headings" style={{ color: '#FF6369' }}>
              Insufficient balance{' '}
            </span>
            <FormatCryptoCurrency
              amount={+balance.formatted}
              address={cartCurrency?.contract}
              decimals={cartCurrency?.decimals}
              logoHeight={18}
              textStyle={'h6'}
              maximumFractionDigits={4}
            />
          </Box>
        )}
        <Button
          onClick={() => signer && execute(signer)}
          disabled={
            cartCount === 0 ||
            waitingTx ||
            Boolean(balance?.formatted && +balance.formatted < cartTotal)
          }
          css={{
            width: '100%',
            textAlign: 'center'
          }}
        >
          {waitingTx ? 'Waiting' : 'Purchase'}
        </Button>
      </StyledContent>
    </Popover.Root>
  )
}
export default CartMenu
