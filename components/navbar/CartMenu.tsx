import {FC} from 'react'
import {faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import {CartPopover, useCart} from '@nftearth/reservoir-kit-ui'
import {Flex} from "../primitives";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const CartMenu: FC = () => {
  const { data: cartItems } = useCart((cart) => cart.items)

  return (
    <CartPopover trigger={
      <Flex
        align="center"
        justify="center"
        css={{
          background: '$gray3',
          width: '44px',
          height: '44px',
          borderRadius: '$lg',
          position: 'relative'
        }}>
        {(cartItems.length > 0) && (
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
            {cartItems.length}
          </Flex>
        )}
        <FontAwesomeIcon icon={faShoppingCart} className="h-[18px] w-[18px]"/>
      </Flex>
    } />
  )
}
export default CartMenu
