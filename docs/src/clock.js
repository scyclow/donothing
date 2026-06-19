import {state} from './state.js'

// elapsed is DERIVED from a timestamp, never counted by ticks. this is what
// keeps multiple tabs from "speeding up" the timer: every tab computes the
// same Date.now() - startedAt, and nothing accumulates per interval.
let startedAt = null
let paused = false // tab hidden / window blurred / pointer left the page
let tickId = null

let resets = 0 // resets in the CURRENT run only; not persisted, so nothing is revealed on load


const tickFns = [
  elapsedMs => {
    if (!state.bestUnlocked && resets > 0 && state.cumulativeSec >= 1) {
      state.bestUnlocked = true
    }

    if (!state.totalUnlocked && resets > 1 && state.cumulativeSec >= 1) {
      state.totalUnlocked = true
    }

    // live total (committed + current streak) so it unlocks mid-streak, not only on reset
    if (!state.moneyUnlocked && state.cumulativeSec + Math.floor(elapsedMs / 1000) >= 60) {
      state.moneyUnlocked = true
    }
  }
]

function onTick(t) {
  tickFns.forEach(fn => fn(t))
}

export const setOnTick = fn => { tickFns.push(fn) }

export const getResets = () => resets

export const getElapsedMs = () =>
  paused || startedAt == null ? 0 : Date.now() - startedAt

export const start = () => {
  paused = false
  startedAt = Date.now()
  resets = 0 // a fresh run reveals nothing until the clock is reset again
  if (!tickId) tickId = setInterval(tick, 250)
  tick()
}

const tick = () => onTick(getElapsedMs())

// commit the just-ended streak into the persisted stats.
const commit = () => {
  const elapsed = getElapsedMs()
  const whole = Math.floor(elapsed / 1000)
  if (whole > 0) state.cumulativeSec += whole // partial seconds are dropped
  if (elapsed > state.bestMs) state.bestMs = elapsed
}

// the user did something on the page (move/click/type): a real reset.
// pausing is NOT a reset, so only this increments the counter the gates read.
export const reset = () => {
  if (state.phase !== 'running' || paused || startedAt == null) return
  commit()

  if (Date.now() - startedAt >= 1000) resets += 1 // 1st reveals best, 2nd reveals total
  startedAt = Date.now()
  onTick(0)
}

// tab hidden / blurred / pointer left: commit the streak and freeze at 0 so
// time spent away never counts (but it does not count as a reset).
export const pause = () => {
  if (state.phase !== 'running' || paused) return
  commit()
  paused = true
  startedAt = null
  onTick(0)
}

// back on the page: start a fresh streak from 0.
export const resume = () => {
  if (state.phase !== 'running' || !paused) return
  paused = false
  startedAt = Date.now()
  tick()
}
