// @ts-ignore TypeScript compilation error due to nothing being exported
type ReservoirWebsocketEventType = 'subscribe' | 'unsubscribe'
type ReservoirWebsocketEvent =
  | 'ask.created'
  | 'ask.updated'
  | 'bid.created'
  | 'bid.updated'
  | 'sale.created'
  | 'sale.updated'
  | 'sale.deleted'
  | 'transfer.created'
  | 'transfer.updated'
  | 'transfer.deleted'
  | 'token.created'
  | 'token.updated'
  | 'collection.created'
  | 'collection.updated'
type ReservoirWebsocketEventFilters =
  | 'contract'
  | 'source'
  | 'maker'
  | 'taker'
  | 'from'
  | 'to'
  | 'id'
type ReservoirWebsocketMessage = {
  type: ReservoirWebsocketEventType
  event: ReservoirWebsocketEvent
  filters?: Partial<Record<ReservoirWebsocketEventFilters, string>>
  changed?: string
}

//Event Payload
type ReservoirWebsocketTokenChanged =
  | 'name'
  | 'description'
  | 'image'
  | 'media'
  | 'collection.id'
  | 'market.floorAsk.id'
  | 'market.floorAsk.price.gross.amount'
  | 'token.rarity'
  | 'token.rarityRanky'
  | 'token.isFlagged'
  | 'token.lastFlagUpdate'
  | 'token.lastFlagChange'
  | 'market.floorAskNormalized.id'
  | 'market.floorAskNormalized.price.gross.amount'
  | 'token.supply'
  | 'token.remainingSupply'

type ReservoirWebsocketIncomingEvent = {
  published_at: number
  type: 'event'
  status: 'success' | 'error'
  event: string
  tags: {
    [key: string]: string
  }
  changed: ReservoirWebsocketTokenChanged[]
  data: any
  offset?: string
}

type SocketState = null | 0 | 1
