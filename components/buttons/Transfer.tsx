import {ChangeEvent, useContext, useState} from "react";
import {
  Root as DialogRoot,
  DialogTrigger,
  DialogPortal,
  Close
} from '@radix-ui/react-dialog'
import {
  useWaitForTransaction,
  useAccount,
  useContractWrite
} from 'wagmi'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faXmark, faWarning, faClose, faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {extractMediaType, TokenMedia, useTokens} from "@reservoir0x/reservoir-kit-ui";
import {MutatorCallback} from "swr";

import {Content} from "../primitives/Dialog";
import {ToastContext} from "../../context/ToastContextProvider";
import {Box, Button, Flex, Input, Text} from "../primitives";

type TransferProps = {
  token: ReturnType<typeof useTokens>['data'][0]
  mutate?: MutatorCallback
}

const ERC721NFTAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const ERC1155NFTAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const Transfer = ({ token, mutate } : TransferProps) => {
  const { addToast } = useContext(ToastContext)
  const { address } = useAccount()
  const [transferAddress, setTransferAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const mediaType = extractMediaType(token?.token)
  const showPreview =
    mediaType === 'other' || mediaType === 'html' || mediaType === null
  const { writeAsync, data, isLoading, error: error } = useContractWrite({
    address: (token?.token?.contract || '0x0') as `0x${string}`,
    abi: token?.token?.kind === 'erc721' ? ERC721NFTAbi : ERC1155NFTAbi,
    functionName: 'safeTransferFrom',
    args: token?.token?.kind === 'erc721' ? [
      address as `0x${string}`,
      transferAddress as `0x${string}`,
      token?.token?.tokenId
    ] : [
      address as `0x${string}`,
      transferAddress as `0x${string}`,
      token?.token?.tokenId,
      quantity,
      ''
    ],
  })

  const { isLoading: isLoadingTransaction, isSuccess = true } = useWaitForTransaction({
    hash: data?.hash,
  })

  const handleSetQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    let qty = parseInt(e.target.value, 10);

    setQuantity(qty < 1 ? 1 : qty);
  }

  const handleTransfer = async () => {
    writeAsync?.().then(() => {
      mutate?.();
    }).catch(() => {
      // Empty
    });
  }

  return (
    <DialogRoot modal={false}>
      <DialogTrigger asChild>
        <Button
          css={{ justifyContent: 'center', width: '44px', height: '44px' }}
          type="button"
          size="small"
          color="gray3"
        >
          <FontAwesomeIcon icon={faPaperPlane} width={16} height={16} />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <Content
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
          css={{
            top: '20%',
            padding: 20,
            zIndex: 9999,
            maxWidth: 500,
            minWidth: 350,
          }}
        >
          {isSuccess ? (
            <Flex align="center" justify="center" direction="column" css={{ textAlign: 'center' }}>
              <FontAwesomeIcon icon={faCheckCircle} size="2xl" color="#b8ff33" style={{ marginBottom: 20 }}/>
              <Box css={{ wordBreak: 'break-word', mb: '$5' }}>
                <Text style="h6">
                  {`Your NFT has successfully transferred to ${transferAddress}`}
                </Text>
              </Box>
              <Close>
                <Button color="secondary">
                  OK
                </Button>
              </Close>
            </Flex>
          ) : (
            <>
              <Close>
                <Flex
                  css={{
                    position: 'fixed',
                    top: 10,
                    right: 10,
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    alignItems: 'center',
                    borderRadius: '$lg',
                    backgroundColor: '$gray3',
                    color: '$gray12',
                    '&:hover': {
                      backgroundColor: '$gray4',
                    },
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} width={16} height={16} />
                </Flex>
              </Close>
              <Flex
                align="center"
                direction="column"
                css={{
                  overflow: 'hidden',
                }}>
                <Box css={{ mb: '$4' }}>
                  <Text style="h4">
                    Transfer your NFT
                  </Text>
                </Box>
                <TokenMedia
                  token={token?.token}
                  style={{
                    width: 150,
                    height: 150,
                    transition: 'transform .3s ease-in-out',
                    maxHeight: 720,
                    borderRadius: '$base',
                    aspectRatio: '1/1',
                    marginBottom: 20,
                    border: '2px solid #5D770D'
                  }}
                  onRefreshToken={() => {
                    mutate?.()
                    addToast?.({
                      title: 'Refresh token',
                      description: 'Request to refresh this token was accepted.',
                    })
                  }}
                />
                <Box css={{ mb: 20 }}>
                  <Box css={{ textAlign: 'center' }}>
                    <strong>{token?.token?.kind === 'erc1155' ? `${quantity}x ` : ''}</strong>
                    <strong>{`"${token?.token?.name ? token.token.name : `${token?.token?.collection?.name} #${token?.token?.tokenId}`}"`}</strong>
                    {` will be transferred to `}
                    <strong>{`${transferAddress == '' ? '...' : transferAddress}`}</strong>
                  </Box>
                  {transferAddress !== '' && (
                    <Box css={{ color: 'orange', mt: '$4', textAlign: 'center' }}>
                      <FontAwesomeIcon icon={faWarning} style={{ marginRight: 5 }}/>
                      {`Items sent to the wrong address cannot be recovered`}
                    </Box>
                  )}
                  {(error && transferAddress !== '') && (
                    <Box css={{ color: 'red', mt: '$4', textAlign: 'center' }}>
                      <FontAwesomeIcon icon={faClose} style={{ marginRight: 5 }}/>
                      {error.message}
                    </Box>
                  )}
                </Box>
                <Flex justify="between" css={{
                  mb: 20,
                  px: 10,
                  width: '100%',
                }}>
                  <Input
                    disabled={isLoading || isLoadingTransaction}
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                    placeholder={"e.g. 0x21ab235523cdd..."}
                    containerCss={{
                      width: '100%',
                    }}
                  />
                  {token?.token?.kind === 'erc1155' && (
                    <Input
                      disabled={isLoading || isLoadingTransaction}
                      value={quantity}
                      onChange={handleSetQuantity}
                      placeholder={"Qty"}
                      type="number"
                      containerCss={{
                        width: 100,
                        ml: '$2'
                      }}
                    />
                  )}
                </Flex>
                {isLoadingTransaction ? (
                  <Text as="h4">Transferring...</Text>
                ) : (
                  <Button disabled={isLoading || isLoadingTransaction || !!error} onClick={handleTransfer}>
                    {isLoading ? `Confirm` : 'Transfer'}
                  </Button>
                )}
              </Flex>
            </>
          )}
        </Content>
      </DialogPortal>
    </DialogRoot>
  )
}

export default Transfer;