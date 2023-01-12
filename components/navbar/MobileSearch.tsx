import { Button, Flex } from 'components/primitives'
import { Content } from 'components/primitives/Dialog'
import {
  Root as DialogRoot,
  DialogTrigger,
  DialogPortal,
} from '@radix-ui/react-dialog'
import * as RadixDialog from '@radix-ui/react-dialog'
import {
  faMagnifyingGlass,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GlobalSearch from './GlobalSearch'

const MobileSearch = () => {
  const children = (
    <Flex
      css={{
        flexDirection: 'column',
        height: '100%',
        pt: '$4',
      }}
    >
      <GlobalSearch placeholder="Search collections and addresses" />
      <Flex
        css={{
          position: 'absolute',
          top: '$4',
          left: '$4',
        }}
        align="center"
        justify="between"
      >
        <RadixDialog.Close>
          <Flex
            css={{
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              alignItems: 'center',
              borderRadius: 8,
              backgroundColor: '$gray3',
              color: '$gray12',
              '&:hover': {
                backgroundColor: '$gray4',
              },
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} width={16} height={16} />
          </Flex>
        </RadixDialog.Close>
      </Flex>
    </Flex>
  )
  return (
    <DialogRoot modal={false}>
      <DialogTrigger asChild>
        <Button
          css={{ justifyContent: 'center', width: '44px', height: '44px' }}
          type="button"
          size="small"
          color="gray3"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} width={16} height={16} />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <Content
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
          css={{
            width: '100%',
            height: '100%',
            borderRadius: '0px',
            border: '0px',
            minWidth: '100%',
            maxWidth: '100vw',
            maxHeight: '100vh',
            top: '0%',
            zIndex: 9999,
          }}
        >
          {children}
        </Content>
      </DialogPortal>
    </DialogRoot>
  )
}

export default MobileSearch
