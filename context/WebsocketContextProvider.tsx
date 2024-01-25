import React, {
  createContext,
  useCallback,
  useRef,
  FC,
  PropsWithChildren,
} from 'react'

type WebsocketStore = {
  subscriptions: Record<number, Record<string, number>>
}

function websocketStore() {
  const store = useRef<WebsocketStore>({
    subscriptions: {},
  })

  const get = useCallback(() => store.current, [])

  const subscribe = useCallback(
    (
      chainId: number,
      messages: ReservoirWebsocketMessage[],
      onSubscribe: (message: any) => void,
      onUnsubscribe: (message: any) => void
    ) => {
      messages.forEach((message) => {
        let subscription = message.event as string
        if (message.filters) {
          Object.keys(message.filters)
            .sort()
            .forEach((key) => {
              subscription = `${subscription}-${key}:${
                message.filters?.[key as ReservoirWebsocketEventFilters]
              }`
            })
        }
        if (message.changed) {
          subscription += `:${message.changed}`
        }
        if (!store.current.subscriptions[chainId]) {
          store.current.subscriptions[chainId] = {}
        }

        if (!store.current.subscriptions[chainId][subscription]) {
          store.current.subscriptions[chainId][subscription] = 0
        }

        const channelSubscriptions =
          store.current.subscriptions[chainId][subscription]

        if (message.type === 'unsubscribe') {
          store.current.subscriptions[chainId][subscription] -= 1
          if (channelSubscriptions <= 0) {
            store.current.subscriptions[chainId][subscription] = 0
            onUnsubscribe(message)
          }
        } else {
          if (!channelSubscriptions) {
            store.current.subscriptions[chainId][subscription] = 1
            onSubscribe(message)
          } else {
            store.current.subscriptions[chainId][subscription] += 1
          }
        }
      })
    },
    []
  )

  return {
    get,
    subscribe,
  }
}

export const WebsocketContext = createContext<ReturnType<
  typeof websocketStore
> | null>(null)

export const WebsocketContextProvider: FC<PropsWithChildren> = function ({
  children,
}) {
  return (
    <WebsocketContext.Provider value={websocketStore()}>
      {children}
    </WebsocketContext.Provider>
  )
}
