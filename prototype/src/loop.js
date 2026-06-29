import {timer} from './models/timer.js'
import {stopEarning, stopHoldEarning} from './models/money.js'
import {evaluateUnlocks} from './unlocks.js'
import {setVeil} from './views/veil.js'

// The autonomous loop that moves time forward and lets one event lead to the
// next: every tick it advances unlocks, then notifies the views to repaint.
// The player's input drives the streak through the activity handlers below.
const subscribers = []
let tickId = null

export const onTick = fn => { subscribers.push(fn) }
const notify = () => subscribers.forEach(fn => fn())

const tick = () => {
  evaluateUnlocks()
  notify()
}

const RESET_EVENTS = ['mousemove', 'click', 'mousedown', 'mouseup', 'keydown']

const onReset = () => { timer.reset(); notify() }
const onPause = () => { timer.pause(); stopEarning(); stopHoldEarning(); setVeil(true); notify() }
const onResume = () => { timer.resume(); setVeil(false); notify() }

const attachActivity = () => {
  RESET_EVENTS.forEach(e => window.addEventListener(e, onReset, {passive: true}))
  document.addEventListener('visibilitychange', () => (document.hidden ? onPause() : onResume()))
  window.addEventListener('blur', onPause)
  window.addEventListener('focus', onResume)
  document.addEventListener('mouseleave', onPause) // pointer left the page
  document.addEventListener('mouseenter', onResume)
}

export const run = () => {
  timer.start()
  if (!tickId) tickId = setInterval(tick, 250)
  tick()
  // defer so the BEGIN/CONTINUE click that started the run doesn't bubble into
  // the reset handler and count as a reset
  setTimeout(attachActivity)
}
