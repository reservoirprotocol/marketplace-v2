import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { WebsocketContext } from 'context/WebsocketContextProvider'
import useChainWebsocket from 'hooks/useChainWebsocket'
import { useContext, useEffect } from 'react'
import { Options } from 'react-use-websocket'
import chains, { DefaultChain } from 'utils/chains'
import validateEvent from 'utils/validateEvent'
import { NORMALIZE_ROYALTIES } from 'pages/_app'

export default (contract: string, chainId?: number, options: Options = {}) => {
  const client = useReservoirClient()
  const activeChain =
    chainId !== undefined
      ? client?.chains.find((chain) => chain.id === chainId)
      : client?.currentChain()
  const chain =
    chains.find((chain) => chain.id === activeChain?.id) || DefaultChain

  const onMessage = (event: MessageEvent<any>): unknown => {
    if (!validateEvent(event)) return

    if (options.onMessage) {
      return options.onMessage({
        ...event,
        data: JSON.parse(event.data) as ReservoirWebsocketIncomingEvent,
      })
    }
  }

  const onOpen = (event: Event): unknown => {
    if (options.onOpen) {
      return options.onOpen(event)
    }
  }

  const onClose = (event: CloseEvent): unknown => {
    if (options.onClose) {
      return options.onClose
    }
  }

  const websocket = useChainWebsocket(chain.id, {
    ...options,
    onMessage,
    onClose,
    onOpen,
  })
  const websocketContext = useContext(WebsocketContext)

  useEffect(() => {
    const subscribeMessages: ReservoirWebsocketMessage[] = [
      {
        type: 'subscribe',
        event: 'token.updated',
        filters: {
          contract,
        },
        changed: NORMALIZE_ROYALTIES
          ? 'market.floorAskNormalized.id'
          : 'market.floorAsk.id',
      },
    ]
    const unsubscribeMessages: ReservoirWebsocketMessage[] = [
      {
        type: 'unsubscribe',
        event: 'token.updated',
        filters: {
          contract,
        },
        changed: NORMALIZE_ROYALTIES
          ? 'market.floorAskNormalized.id'
          : 'market.floorAsk.id',
      },
    ]

    const sendSubscribeMessages = (message: any) => {
      websocket.sendJsonMessage(message)
    }

    const sendUnsubscribeMessages = (message: any) => {
      websocket.sendJsonMessage(message)
    }

    websocketContext?.subscribe(
      chain.id,
      subscribeMessages,
      sendSubscribeMessages,
      sendUnsubscribeMessages
    )

    return () => {
      websocketContext?.subscribe(
        chain.id,
        unsubscribeMessages,
        sendSubscribeMessages,
        sendUnsubscribeMessages
      )
    }
  }, [contract])

  return websocket
}
