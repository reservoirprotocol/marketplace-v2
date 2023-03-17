import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Flex, Button, Text, TableRow, TableCell } from 'components/primitives'
import { CartItem, useCart } from '@reservoir0x/reservoir-kit-ui'
import { Dialog } from 'components/primitives/Dialog'
import { useContext } from 'react'
import { LoreContext } from './Context'

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const CartModal = ({open, onOpenChange}: Props) => {
  const { data: cartItems, remove } = useCart((cart) => cart ? cart.items: []);

  const { squadId, token} = useContext(LoreContext);
  if (!cartItems?.length) {
    return null
  }
  const onClickCheckout = async (cartItem: CartItem) => {
    const body = {
      "proposal": {
        "tokenId":  cartItem.token.id,
        "contractAddress": cartItem.collection.id,
        "name": cartItem.token.name,
        "image": `http://localhost:3000/api/reservoir/ethereum/redirect/tokens/${cartItem.collection.id}:${cartItem.token.id}/image/v1`,
        "price": cartItem.price?.amount?.raw,
        "collection": cartItem.collection.name,
        "isOwner":true,
        "squad":{
           "id":squadId,
        },
        "listingHash":"",
        "marketplace":"seaport-v1.4",
        "data":{
           
        }
      },
      "token": token
    }
    await fetch("http://localhost:3000/api/plugins/lore/proposal", {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST"
    })  
    await remove([`${cartItem.collection.id}:${cartItem.token.id}`]);
  }
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      overlayProps={{ style: { opacity: 0.7 } }}
    >
      <Flex direction="column" css={{ p: 24, gap: '$2', background: '$gray2' }}>
        <Text style="h5">
          Checkout With Lore
        </Text>
        {
          cartItems.map((c, index) => (
            <TableRow key={index} css={{ gridTemplateColumns: '1fr 2fr 1fr 1fr' }}>
              <TableCell>
                <img width={100} height={100} alt="nft" src={"http://localhost:3000/api/reservoir/ethereum/redirect/tokens/0xb7f7f6c52f2e2fdb1963eab30438024864c313f6:3974/image/v1"} />
              </TableCell>
              <TableCell>
                <Text style="body1">{c.collection.name}</Text><br />
                <Text style="body2">{c.token.name}</Text>
              </TableCell>
              <TableCell>
                <Text style="body1">{c.price?.amount?.decimal} {c.price?.currency?.symbol}</Text>
              </TableCell>
              <TableCell>
                <Button onClick={() => onClickCheckout(c)}>
                  <FontAwesomeIcon icon={faShoppingCart} width="16" height="16" />
                  Checkout
                </Button>
              </TableCell>
            </TableRow>
          ))
        }
      </Flex>

    </Dialog>
  )
}

export default CartModal
