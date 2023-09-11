/**
 * # validateEvent
 * Validates an event that is recieved from the WebSocket
 * @param event  Incoming WebSocket message
 * @returns {undefined | ReservoirWebsocketIncomingEvent} undefined | ReservoirWebsocketIncomingEvent
 */
function validateEvent(
  event: MessageEvent<any>
): ReservoirWebsocketIncomingEvent | void {
  if (!event.data || typeof event.data !== 'string') {
    return
  }
  let reservoirEvent: ReservoirWebsocketIncomingEvent | undefined
  try {
    reservoirEvent = JSON.parse(event.data)
  } catch (e: unknown) {
    return
  }
  if (!reservoirEvent) {
    return
  }
  return reservoirEvent
}

export default validateEvent
