import {persist} from './persist.js'
import {queryParams} from './$.js'
import {ARROW_SVGS} from './components/misc.js'
import {onTick} from './timer.js'



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
  moneyPopupDismissed: false,
  achievementsDisplayed: false,

  get tabActive() {
    return !document.hidden
  },

  achievementList: {
    0: {
      completed: false,
      claimed: false,
      displayed: false,
      initialDisplay() {
        return globalState.currentNothingTimeStreak >= 27
      },
      criteria() {
        return globalState.currentNothingTimeStreak >= 60
      },
      display() {
        return `Current Streak ${ARROW_SVGS['→']} ${formatTime(60 - globalState.currentNothingTimeStreak)}`
      }
    },
  }



})


onTick(() => {
  Object.values(globalState.achievementList).forEach(a => {
    if (a.criteria()) a.completed = true
    if (a.initialDisplay()) a.displayed = true
  })
})



// Mark game as stopped on load
if (globalState.gameStarted) {
  globalState.gameStopped = true
}

// Object.defineProperty(globalState, 'tabActive', {
//   get() {
//     return !document.hidden
//   }
// })

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
