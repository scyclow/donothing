import {SoundSrc} from './audio.js'
import {globalState} from './state.js'


const tickFns = []

export const onTick = fn => tickFns.push(fn)

const src1 = new SoundSrc()


const onPauseFns = []
const onResumeFns = []
const onClearFns = []

export function onPause(fn) {
  onPauseFns.push(fn)
}
export function onResume(fn) {
  onResumeFns.push(fn)
}
export function onClear(fn) {
  onClearFns.push(fn)
}

function clear() {
  onClearFns.forEach(fn => fn())

  globalState.doingNothing = false
  if (globalState.currentNothingTimeStreak > 0) globalState.lastTimeStreak = globalState.currentNothingTimeStreak
  globalState.currentNothingTimeStreak = 0

}

function pause() {
  clear()
  onPauseFns.forEach(fn => fn())
  globalState.gamePaused = true
}

function resume() {
  globalState.doingNothing = true
  globalState.gamePaused = false
  onResumeFns.forEach(fn => fn())
}


document.addEventListener('visibilitychange', () =>
  (document.hidden || !document.hasFocus()) && pause()
)

window.addEventListener('blur', pause)
window.addEventListener('focus', resume)
document.addEventListener('mouseleave', pause)
document.addEventListener('mouseenter', resume)


const CLEAR_EVENTS = ['mousemove', 'click', 'mousedown', 'mouseup', 'keydown', 'blur', 'mouseleave', 'scroll']

CLEAR_EVENTS.forEach(e => window.addEventListener(e, clear, {passive: true}))


let timerInterval

const runTimer = () => {
  clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    globalState.currentNothingTimeStreak += 1
    globalState.totalNothingTime += 1

    if (globalState.bestNothingTimeStreak < globalState.currentNothingTimeStreak) {
      globalState.bestNothingTimeStreak = globalState.currentNothingTimeStreak
    }

    tickFns.forEach(fn => fn(globalState.currentNothingTimeStreak, globalState.totalNothingTime))

  }, 1000)
}

onResume(runTimer)

onPause(() => {
  clearInterval(timerInterval)
})


onClear(() => {
  if (globalState.currentNothingTimeStreak) src1.note(500, 150)

  if (!globalState.gamePaused) {
    runTimer()
  }
})
