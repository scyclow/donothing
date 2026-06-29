import {state} from './state.js'
import {timer} from './models/timer.js'

const liveTotalSec = () => state.cumulativeSec + Math.floor(timer.elapsedMs() / 1000)

// Declarative visibility. Each key flips a persisted `${key}Unlocked` flag the
// first time its condition holds; once unlocked it stays unlocked. To gate a
// new feature on the player's progress, just add a line here.
const conditions = {
  best: () => timer.resets() > 0 && state.cumulativeSec >= 1,
  total: () => timer.resets() > 1 && state.cumulativeSec >= 1,
  money: () => liveTotalSec() >= 60,
}

// run every loop tick: this is how time/earnings lead to new things appearing.
export const evaluateUnlocks = () => {
  for (const key in conditions) {
    const flag = `${key}Unlocked`
    if (!state[flag] && conditions[key]()) state[flag] = true
  }
}

export const unlocked = key => state[`${key}Unlocked`]
