import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Flex, Button, Text } from 'components/primitives'
import { useCart } from '@reservoir0x/reservoir-kit-ui'
import { useState } from 'react'
import CartModal from './CartModal'
import { Provider } from './Context'

const CartButton = () => {
  const { data: cartItems } = useCart((cart) => cart ? cart.items: []);

  const [open, setOpen] = useState(false);
  if (!cartItems?.length) {
    return null
  }

  return (
    <Provider>
      <Button
        onClick={() => setOpen(true)}
        css={{
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          position: 'relative',
        }}
        size="small"
        color="gray3"
        >
        <FontAwesomeIcon icon={faShoppingCart} width="16" height="16" />
        {cartItems.length > 0 && (
          <Flex
            align="center"
            justify="center"
            css={{
              borderRadius: '99999px',
              width: 20,
              height: 20,
              backgroundColor: '$primary9',
              position: 'absolute',
              top: -8,
              right: -6,
            }}
          >
            <Text style="subtitle3" css={{ color: 'white' }}>
              {cartItems.length}
            </Text>
          </Flex>
        )}
      </Button>
      <CartModal open={open} onOpenChange={setOpen}  />
    </Provider>
  )
}

export default CartButton
