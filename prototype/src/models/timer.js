import {state} from '../state.js'

// The do-nothing streak. Elapsed is derived from a timestamp (so multiple tabs
// can't make it run fast). Resets count only streaks of >= 1s and live purely
// in memory, so a refresh reveals nothing until the clock is reset again.
let startedAt = null
let paused = false
let resetCount = 0

// fold the just-ended streak into the persisted stats.
const commit = () => {
  const elapsed = timer.elapsedMs()
  const whole = Math.floor(elapsed / 1000)
  if (whole > 0) state.cumulativeSec += whole // partial seconds are dropped
  if (elapsed > state.bestMs) state.bestMs = elapsed
}

export const timer = {
  start() {
    paused = false
    startedAt = Date.now()
    resetCount = 0
  },

  elapsedMs() {
    return paused || startedAt == null ? 0 : Date.now() - startedAt
  },

  resets() {
    return resetCount
  },

  // the user did something on the page: commit the streak and restart at 0.
  reset() {
    if (state.phase !== 'running' || paused || startedAt == null) return
    commit()
    if (Date.now() - startedAt >= 1000) resetCount += 1
    startedAt = Date.now()
  },

  // page went inactive: commit and freeze at 0 (this is not a reset).
  pause() {
    if (state.phase !== 'running' || paused) return
    commit()
    paused = true
    startedAt = null
  },

  // page active again: start a fresh streak.
  resume() {
    if (state.phase !== 'running' || !paused) return
    paused = false
    startedAt = Date.now()
  },
}
