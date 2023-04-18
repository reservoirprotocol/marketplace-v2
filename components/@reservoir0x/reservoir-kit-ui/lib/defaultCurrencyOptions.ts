import { Currency } from "types/currency"

const currencyOptions: Currency[] = [
  {
    // description: pay by ETH that mean can pay by WETH
    contract: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    symbol: "ETH/WETH",
    decimals: 18
  },
  {
    // TO-DO: import from sdk
    contract: "0x1559b550a5b35d3d5a76d7d7e4d07fd31ee96c00",
    symbol: "USDT",
    decimals: 18
  },
]

export default currencyOptions
