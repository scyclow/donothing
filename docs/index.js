import {state, clearState} from './src/state.js'
import * as clock from './src/clock.js'
import * as views from './src/views.js'
import {stopEarning, stopHoldEarning} from './src/money.js'

// input wiring, attached only while a streak is running:
//  - reset events: the user did something on the page -> restart the streak at 0
//  - pause: page no longer active (tab hidden, window blurred, pointer left) -> freeze
//  - resume: page active again -> fresh streak
const RESET_EVENTS = ['mousemove', 'click', 'mousedown', 'mouseup', 'keydown']

const attachActivity = ({onReset, onPause, onResume}) => {
  RESET_EVENTS.forEach(e => window.addEventListener(e, onReset, {passive: true}))
  document.addEventListener('visibilitychange', () => (document.hidden ? onPause() : onResume()))
  window.addEventListener('blur', onPause)
  window.addEventListener('focus', onResume)
  document.addEventListener('mouseleave', onPause) // pointer left the page
  document.addEventListener('mouseenter', onResume)
}

const startRun = () => {
  state.phase = 'running'
  const view = views.renderRunning()
  clock.setOnTick(view.update)
  clock.start()
  // defer attaching listeners so the BEGIN/CONTINUE click that triggered this
  // doesn't bubble up to the window reset handler and count as a reset
  setTimeout(() => attachActivity({
    onReset: clock.reset,
    onPause: () => { clock.pause(); stopEarning(); stopHoldEarning(); views.setVeil(true) },
    onResume: () => { clock.resume(); views.setVeil(false) },
  }))
}

const restart = () => {
  clearState()
  location.reload()
}

// boot. a refresh always restarts the live timer at 0:
//  - never begun  -> BEGIN screen
//  - otherwise     -> resume screen with stats + continue / restart
if (state.phase === 'idle') {
  views.renderBegin(startRun)
} else {
  state.phase = 'resume'
  views.renderResume({onContinue: startRun, onRestart: restart})
}
