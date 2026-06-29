import {persist} from './persist.js'
import {queryParams} from './$.js'
import {ARROW_SVGS} from './components/misc.js'
import {onTick, onClear} from './timer.js'



export const globalState = persist('__DO_NOTHING_GLOBAL_STATE', {
  currentNothingTimeStreak: 0,
  bestNothingTimeStreak: 0,
  totalNothingTime: 0,
  lastTimeStreak: 0,
  totalSeconds: 0,
  totalClears: 0,
  doingNothing: false,
  gameStarted: false,
  gameStopped: false,
  gamePaused: false,

  moneyPopupDisplayed: false,
  moneyPopupDismissed: false,
  achievementsDisplayed: false,

  balanceCents: 0,
  storeUnlocked: false,
  statsUnlocked: false,
  moneyBoxUnlocked: false,
  adBlockerUnlocked: false,
  adBlockerEnabled: false,

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
      },
      onClaim() {
        globalState.storeUnlocked = true
        globalState.moneyBoxUnlocked = true
        window.dispatchEvent(new CustomEvent('nothingAchievementClaimed', {detail: '0'}))
        window.dispatchEvent(new CustomEvent('nothingModuleUnlocked'))
      }
    },
    1: {
      completed: false,
      claimed: false,
      displayed: false,
      initialDisplay() {
        return globalState.achievementList[0].claimed && globalState.currentNothingTimeStreak >= 3
      },
      criteria() {
        return globalState.currentNothingTimeStreak >= 120
      },
      display() {
        return `Current Streak ${ARROW_SVGS['→']} ${formatTime(120 - globalState.currentNothingTimeStreak)}`
      },
      onClaim() {
        globalState.statsUnlocked = true
        window.dispatchEvent(new CustomEvent('nothingModuleUnlocked'))
      }
    }
  }
})


onTick(() => {
  Object.values(globalState.achievementList).forEach(a => {
    if (a.criteria()) a.completed = true
    if (a.initialDisplay()) a.displayed = true
  })
})

onClear(() => {
  if (globalState.currentNothingTimeStreak > 0) globalState.totalClears += 1
})


// Mark game as stopped on load
if (globalState.gameStarted) {
  globalState.gameStopped = true
}

window.globalState = globalState

export function startGame() {
  globalState.gameStarted = true

  setInterval(() => {
    globalState.totalSeconds += 1
  }, 1000)
}

export function continueGame() {
  globalState.gameStopped = false
  setInterval(() => {
    globalState.totalSeconds += 1
  }, 1000)
}




export const DEV_MODE = queryParams.dev === 'true'
