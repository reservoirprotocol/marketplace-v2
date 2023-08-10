import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { WebsocketContext } from 'context/WebsocketContextProvider'
import useChainWebsocket from 'hooks/useChainWebsocket'
import { useContext, useEffect } from 'react'
import { Options } from 'react-use-websocket'
import chains, { DefaultChain } from 'utils/chains'
import validateEvent from 'utils/validateEvent'

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

    return options.onMessage?.call(this, {
      ...event,
      data: JSON.parse(event.data) as ReservoirWebsocketIncomingEvent,
    })
  }

  const websocket = useChainWebsocket(chain.id, { ...options, onMessage })
  const websocketContext = useContext(WebsocketContext)

  useEffect(() => {
    const subscribeMessages: ReservoirWebsocketMessage[] = [
      {
        type: 'subscribe',
        event: 'token.updated',
        filters: {
          contract,
        },
        changed: 'market.floorAskNormalized.id',
      },
      {
        type: 'subscribe',
        event: 'token.updated',
        filters: {
          contract,
        },
        changed: 'market.floorAskNormalized.price.gross.amount',
      },
    ]
    const unsubscribeMessages: ReservoirWebsocketMessage[] = [
      {
        type: 'unsubscribe',
        event: 'token.updated',
        filters: {
          contract,
        },
        changed: 'market.floorAskNormalized.id',
      },
      {
        type: 'unsubscribe',
        event: 'token.updated',
        filters: {
          contract,
        },
        changed: 'market.floorAskNormalized.price.gross.amount',
      },
    ]

    const sendSubscribeMessages = () => {
      subscribeMessages.forEach((msg) => websocket.sendJsonMessage(msg))
    }
    const sendUnsubscribeMessages = () => {
      unsubscribeMessages.forEach((msg) => websocket.sendJsonMessage(msg))
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
