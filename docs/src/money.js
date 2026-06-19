import {state} from './state.js'

// $0.01 for every full 250ms the pointer sits inside the hover box.
// setInterval fires only after a complete 250ms, so partial hovers earn nothing.
let earnId = null
let onEarn = () => {}

// lets the view repaint the balance the moment a cent lands, instead of
// waiting for the next 250ms clock tick.
export const setOnEarn = fn => { onEarn = fn }

const earn = () => {
  state.balanceCents += 1 // one cent
  if (!state.balanceShown) state.balanceShown = true
  onEarn()
}

// hover only earns while the mouse isn't held down and hasn't been for 100ms,
// so holding pays the hold rate alone instead of stacking with hover.
let isDown = false
let releasedAt = 0
const hoverAllowed = () => !isDown && Date.now() - releasedAt >= 100

export const startEarning = () => {
  if (earnId) return
  earnId = setInterval(() => { if (hoverAllowed()) earn() }, 500)
}

export const stopEarning = () => {
  clearInterval(earnId)
  earnId = null
}

// the "hold" earner: $0.01 for every full 125ms the mouse is held down inside the box.
let holdId = null

export const startHoldEarning = () => {
  isDown = true
  if (holdId) return
  holdId = setInterval(earn, 200)
}

export const stopHoldEarning = () => {
  if (isDown) releasedAt = Date.now() // start the 100ms hover grace period
  isDown = false
  clearInterval(holdId)
  holdId = null
}

// the "click" section: $0.01 per click (earn() fires onEarn, so the $ repaints immediately).
export const clickEarn = () => earn()

export const formatMoney = () => `$${(state.balanceCents / 100).toFixed(2)}`
