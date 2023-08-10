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
    // Ensure the event is parsable and is a reservoir event
    if (!validateEvent(event)) return

    // If it is then we callback to the original function with the modified 
    return options.onMessage?.call(this, {
      ...event,
      data: JSON.parse(event.data) as ReservoirWebsocketIncomingEvent,
    })
  }

  const websocket = useChainWebsocket(chain.id, { onMessage, ...options })
  const websocketContext = useContext(WebsocketContext)

  useEffect(() => {
    const subscribeMessage: ReservoirWebsocketMessage = {
      type: 'subscribe',
      event: 'token.updated',
      filters: {
        contract,
      },
    }
    const unsubscribeMessage: ReservoirWebsocketMessage = {
      type: 'unsubscribe',
      event: 'token.updated',
      filters: {
        contract,
      },
    }
    const sendSubscribeMessage = () => {
      websocket.sendJsonMessage(subscribeMessage)
    }
    const sendUnsubscribeMessage = () => {
      websocket.sendJsonMessage(subscribeMessage)
    }
    websocketContext?.subscribe(
      chain.id,
      subscribeMessage,
      sendSubscribeMessage,
      sendUnsubscribeMessage
    )

    return () => {
      websocketContext?.subscribe(
        chain.id,
        unsubscribeMessage,
        sendSubscribeMessage,
        sendUnsubscribeMessage
      )
    }
  }, [contract])

  return websocket
}
