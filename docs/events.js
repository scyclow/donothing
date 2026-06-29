


const onEvent = []
const eventQueue = []

export const registerEvent = fn => onEvent.push(fn)

let isHandlingEvents = false
export const emitEvent = event => {
  eventQueue.push(event)

  if (!isHandlingEvents) {
    isHandlingEvents = true

    while (eventQueue.length) {
      const e = eventQueue.shift()
      onEvent.forEach(handler => handler(e))
    }

    isHandlingEvents = false
  }


}