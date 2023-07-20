import CryptoCurrencyIcon from 'components/primitives/CryptoCurrencyIcon'
import {
  Box,
  Button,
  Flex,
  FormatCrypto,
  FormatCurrency,
  Text,
} from 'components/primitives'
import { mainnet, polygon, optimism } from 'wagmi/chains'
import { useAccount, useContractReads, erc20ABI, useBalance } from 'wagmi'
import useCoinConversion from 'hooks/useCoinConversion'
import { useMemo, useState } from 'react'
import { zeroAddress, formatUnits } from 'viem'

//CONFIGURABLE: Here you may configure currencies that you want to display in the wallet menu. Native currencies,
//like ETH/MATIC etc need to be fetched in a different way. Configure them below
const currencies = [
  {
    address: zeroAddress,
    symbol: 'ETH',
    decimals: mainnet.nativeCurrency.decimals,
    chain: {
      id: mainnet.id,
      name: mainnet.name,
    },
    coinGeckoId: 'ethereum',
  },
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    decimals: mainnet.nativeCurrency.decimals,
    chain: {
      id: mainnet.id,
      name: mainnet.name,
    },
    coinGeckoId: 'weth',
  },
  {
    address: zeroAddress,
    symbol: 'MATIC',
    decimals: polygon.nativeCurrency.decimals,
    chain: {
      id: polygon.id,
      name: polygon.name,
    },
    coinGeckoId: 'matic-network',
  },
  {
    address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    symbol: 'WETH',
    decimals: polygon.nativeCurrency.decimals,
    chain: {
      id: polygon.id,
      name: polygon.name,
    },
    coinGeckoId: 'weth',
  },
  {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    decimals: optimism.nativeCurrency.decimals,
    chain: {
      id: optimism.id,
      name: optimism.name,
    },
    coinGeckoId: 'weth',
  },
]

type EnhancedCurrency = (typeof currencies)[0] & {
  usdPrice: number
  balance: string | number | bigint
}

const nonNativeCurrencies = currencies.filter(
  (currency) => currency.address !== zeroAddress
)

const currencySymbols = currencies.map((currency) => currency.symbol).join(',')
const currencyCoingeckoIds = currencies
  .map((currency) => currency.coinGeckoId)
  .join(',')

const Wallet = () => {
  const [viewAll, setViewAll] = useState(false)
  const { address } = useAccount()
  const { data: nonNativeBalances } = useContractReads({
    contracts: nonNativeCurrencies.map((currency) => ({
      abi: erc20ABI,
      address: currency.address as `0x${string}`,
      chainId: currency.chain.id,
      functionName: 'balanceOf',
      args: [address as any],
    })),
    watch: true,
    enabled: address ? true : false,
    allowFailure: false,
  })

  //CONFIGURABLE: Configure these by just changing the chainId to fetch native balance info, in addition to changing this
  // also make sure you change the enhancedCurrencies function to take into account for these new balances
  const ethBalance = useBalance({
    address,
    chainId: mainnet.id,
  })
  const maticBalance = useBalance({
    address,
    chainId: polygon.id,
  })

  const usdConversions = useCoinConversion(
    'USD',
    currencySymbols,
    currencyCoingeckoIds
  )

  const enhancedCurrencies = useMemo(() => {
    const currencyToUsdConversions = usdConversions.reduce((map, data) => {
      map[data.symbol] = data
      map[data.id] = data
      return map
    }, {} as Record<string, (typeof usdConversions)[0]>)

    return currencies.map((currency, i) => {
      let balance: string | number | bigint = 0n
      if (currency.address === zeroAddress) {
        //CONFIGURABLE: Configure these to show the fetched balance results configured above in the useBalance hooks
        switch (currency.chain.id) {
          case polygon.id: {
            balance = maticBalance.data?.value || 0n
            break
          }
          case mainnet.id: {
            balance = ethBalance.data?.value || 0n
            break
          }
        }
      } else {
        const index = nonNativeCurrencies.findIndex(
          (nonNativeCurrency) =>
            nonNativeCurrency.chain.id === currency.chain.id &&
            nonNativeCurrency.symbol === currency.symbol &&
            nonNativeCurrency.coinGeckoId === currency.coinGeckoId
        )
        balance =
          nonNativeBalances &&
          nonNativeBalances[index] &&
          (typeof nonNativeBalances[index] === 'string' ||
            typeof nonNativeBalances[index] === 'number' ||
            typeof nonNativeBalances[index] === 'bigint')
            ? (nonNativeBalances[index] as string | number | bigint)
            : 0n
      }

      const conversion =
        currencyToUsdConversions[
          currency.coinGeckoId.length > 0
            ? currency.coinGeckoId
            : currency.symbol.toLowerCase()
        ]
      const usdPrice =
        Number(formatUnits(BigInt(balance), currency?.decimals || 18)) *
        (conversion?.price || 0)
      return {
        ...currency,
        usdPrice,
        balance,
      }
    }) as EnhancedCurrency[]
    //CONFIGURABLE: Configure these to regenerate whenever a native balance changes, non native balances are already handled
  }, [usdConversions, nonNativeBalances, ethBalance, maticBalance])

  const totalUsdBalance = useMemo(() => {
    return enhancedCurrencies.reduce(
      (total, { usdPrice }) => total + usdPrice,
      0
    )
  }, [enhancedCurrencies])

  const visibleCurrencies = viewAll
    ? enhancedCurrencies
    : enhancedCurrencies.slice(0, 3)

  return (
    <Flex
      direction="column"
      align="center"
      css={{
        background: '$gray2',
        borderRadius: 8,
        mt: '$3',
      }}
    >
      <Text css={{ p: '$3' }}>Wallet</Text>
      <Box css={{ width: '100%', height: 1, background: '$gray1' }}></Box>
      <Flex direction="column" align="center" css={{ p: '$4', width: '100%' }}>
        <Text style="body2" color="subtle" css={{ mb: '$2' }}>
          Total Balance
        </Text>
        <FormatCurrency
          style="h4"
          amount={totalUsdBalance}
          css={{ mb: '$4' }}
        />
        <Button
          css={{ width: '100%', justifyContent: 'center' }}
          onClick={() => {
            window.open('https://app.uniswap.org/', '_blank')
          }}
        >
          Add Funds
        </Button>
        {visibleCurrencies.map((currency, i) => {
          return (
            <Flex
              key={i}
              css={{ width: '100%', mt: 28, gap: '$3' }}
              align="center"
            >
              <Flex
                css={{
                  width: 40,
                  height: 40,
                  background: '$gray3',
                  borderRadius: 4,
                  flexShrink: 0,
                }}
                align="center"
                justify="center"
              >
                <CryptoCurrencyIcon
                  address={currency.address}
                  chainId={currency.chain.id}
                  css={{ height: 24 }}
                />
              </Flex>
              <Flex direction="column" justify="center" css={{ width: '100%' }}>
                <Flex justify="between">
                  <Text style="body1">{currency.symbol}</Text>
                  <FormatCrypto
                    amount={currency.balance}
                    decimals={currency.decimals}
                    textStyle="body1"
                  />
                </Flex>
                <Flex justify="between">
                  <Text style="body2" color="subtle">
                    {currency.chain.name}
                  </Text>
                  <Text style="body2" color="subtle"></Text>
                  <FormatCurrency amount={currency.usdPrice} />
                </Flex>
              </Flex>
            </Flex>
          )
        })}
        <Button
          css={{
            width: '100%',
            justifyContent: 'center',
            mt: 24,
            mb: '$3',
          }}
          color="gray3"
          onClick={() => {
            setViewAll(!viewAll)
          }}
        >
          View {viewAll ? 'Fewer' : 'All'} Tokens
        </Button>
      </Flex>
    </Flex>
  )
}

export default Wallet
