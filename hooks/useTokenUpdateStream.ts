import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { WebsocketContext } from 'context/WebsocketContextProvider'
import useChainWebsocket from 'hooks/useChainWebsocket'
import { useContext, useEffect } from 'react'
import { Options } from 'react-use-websocket'
import chains, { DefaultChain } from 'utils/chains'

export default (contract: string, chainId?: number, options: Options = {}) => {
  const client = useReservoirClient()
  const activeChain =
    chainId !== undefined
      ? client?.chains.find((chain) => chain.id === chainId)
      : client?.currentChain()
  const chain =
    chains.find((chain) => chain.id === activeChain?.id) || DefaultChain
  const websocket = useChainWebsocket(chain.id, options)
  const websocketContext = useContext(WebsocketContext)

  useEffect(() => {
    const subscribeMessage: ReservoirWebsocketMessage = {
      type: 'subscribe',
      event: 'token.updated',
      filters: {
        contract,
      },
      changed: 'market.floorAskNormalized.id',
    }
    const unsubscribeMessage: ReservoirWebsocketMessage = {
      type: 'unsubscribe',
      event: 'token.updated',
      filters: {
        contract,
      },
      changed: 'market.floorAskNormalized.id',
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

  useEffect(() => {
    const subscribeMessage: ReservoirWebsocketMessage = {
      type: 'subscribe',
      event: 'token.updated',
      filters: {
        contract,
      },
      changed: 'market.floorAskNormalized.price.gross.amount',
    }
    const unsubscribeMessage: ReservoirWebsocketMessage = {
      type: 'unsubscribe',
      event: 'token.updated',
      filters: {
        contract,
      },
      changed: 'market.floorAskNormalized.price.gross.amount',
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
