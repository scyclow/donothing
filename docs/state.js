import {persist} from './persist.js'
import {queryParams} from './$.js'



export const globalState = persist('__DO_NOTHING_GLOBAL_STATE', {
  currentNothingTimeStreak: 0,
  bestNothingTimeStreak: 0,
  totalNothingTime: 0,
  lastTimeStreak: 0,
  totalSeconds: 0,
  doingNothing: false,
  gameStarted: false,
  gameStopped: false,
  gamePaused: false,

  moneyPopupDisplayed: false,
  moneyPopupDismissed: false
})



// Mark game as stopped on load
if (globalState.gameStarted) {
  globalState.gameStopped = true
}

Object.defineProperty(globalState, 'tabActive', {
  get() {
    return !document.hidden
  }
})

window.globalState = globalState

export function startGame() {
  globalState.gameStarted = true

  setInterval(() => {
    globalState.totalSeconds += 1
  }, 1000)
}

export function continueGame() {
  globalState.gameStopped = false
}




export const DEV_MODE = queryParams.dev === 'true'
