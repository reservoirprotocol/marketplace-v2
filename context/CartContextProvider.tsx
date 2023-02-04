import {
  useState,
  createContext,
  SetStateAction,
  Dispatch,
  FC,
} from 'react'
import {Token} from "@nftearth/reservoir-sdk";

type CartItemType = {
  token: Token,

}

export const CartContext = createContext<{
  items: Array<CartItemType>
  setItems: Dispatch<SetStateAction<Array<CartItemType>>> | null
  addToCart: ((item: CartItemType) => void) | null
}>({
  items: [],
  setItems: null,
  addToCart: null,
})

const CartContextProvider: FC<any> = ({ children }) => {
  const [items, setItems] = useState<Array<CartItemType>>([])

  const addToCart = (item: CartItemType) => {
    setItems([...items, item])
  }

  return (
    <CartContext.Provider value={{ items, addToCart, setItems }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContextProvider
