import FormatCurrency from 'components/FormatCurrency'
import { FC, ComponentProps } from 'react'

type FormatEthProps = {
  logoWidth?: number
}

type Props = ComponentProps<typeof FormatCurrency> & FormatEthProps

const FormatEth: FC<Props> = ({
  amount,
  maximumFractionDigits,
  logoWidth = 8,
  css,
}) => {
  return (
    <FormatCurrency
      css={css}
      amount={amount}
      maximumFractionDigits={maximumFractionDigits}
    >
      <img src="/eth.svg" alt="ETH logo" style={{ width: `${logoWidth}px` }} />
    </FormatCurrency>
  )
}

export default FormatEth
