import { utils } from 'ethers'
import { BigNumberish } from '@ethersproject/bignumber'

const { format: formatUsdCurrency } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function formatDollar(price?: number | null) {
  return price !== undefined && price !== null ? formatUsdCurrency(price) : '-'
}

function formatNumber(
  amount: number | null | undefined | string,
  maximumFractionDigits: number = 2
) {
  const { format } = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maximumFractionDigits,
  })
  if (!amount) {
    return '-'
  }
  return format(+amount)
}

const trauncateFractionAndFormat = (
  parts: Intl.NumberFormatPart[],
  digits: number
) => {
  return parts
    .map(({ type, value }) => {
      if (type !== 'fraction' || !value || value.length < digits) {
        return value
      }

      let formattedValue = ''
      for (
        let idx = 0, counter = 0;
        idx < value.length && counter < digits;
        idx++
      ) {
        if (value[idx] !== '0') {
          counter++
        }
        formattedValue += value[idx]
      }
      return formattedValue
    })
    .reduce((string, part) => string + part)
}

/**
 *  Convert ETH values to human readable formats
 * @param amount An ETH amount
 * @param maximumFractionDigits Number of decimal digits
 * @param decimals Number of decimal digits for the atomic unit
 * @returns returns the ETH value as a `string` or `-` if the amount is `null` or `undefined`
 */
function formatBN(
  amount: BigNumberish | null | undefined,
  maximumFractionDigits: number,
  decimals: number = 18
) {
  if (typeof amount === 'undefined' || amount === null) return '-'

  const amountToFormat =
    typeof amount === 'number' ? amount : +utils.formatUnits(amount, decimals)

  const parts = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
    notation: 'compact',
    compactDisplay: 'short',
  }).formatToParts(amountToFormat)

  if (parts && parts.length > 0) {
    return trauncateFractionAndFormat(parts, maximumFractionDigits)
  } else {
    return typeof amount === 'string' || typeof amount === 'number'
      ? `${amount}`
      : ''
  }
}

export { formatDollar, formatBN, formatNumber }
