import {state} from '../state.js'

// The money entity: a single balance (in whole cents, to avoid float drift)
// fed by three earners on one box — click, hover, and hold.
let onEarn = () => {}

// lets the view repaint the balance the moment a cent lands, instead of
// waiting for the next loop tick.
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

let earnId = null

export const startEarning = () => {
  if (earnId) return
  earnId = setInterval(() => { if (hoverAllowed()) earn() }, 500)
}

export const stopEarning = () => {
  clearInterval(earnId)
  earnId = null
}

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

export const clickEarn = () => earn()

export const formatMoney = () => `$${(state.balanceCents / 100).toFixed(2)}`
