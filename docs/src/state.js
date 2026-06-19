import {persist} from '../persist.js'

// the entire game state. lives in local storage via persist()'s deep proxy:
// any assignment to a field below writes through to LS automatically.
//
// note: the live running timer is NOT stored here. a refresh is itself an
// action, so the current streak always restarts at 0 on load (see index.js).
export const INIT = {
  phase: 'idle', // 'idle' (pre-BEGIN) | 'running' | 'resume' (stats screen)
  bestMs: 0, // longest single streak, in ms
  cumulativeSec: 0, // sum of floor(streak seconds) across all committed streaks
  balanceCents: 0, // money earned, in whole cents (avoids float drift)
  balanceShown: false, // once balance goes positive it's revealed forever
  bestUnlocked: false,
  totalUnlocked: false,
  moneyUnlocked: false, // the money box, unlocked after 60s of nothing
}

export const state = persist('donothing', INIT)

export const clearState = () => localStorage.removeItem('donothing')
