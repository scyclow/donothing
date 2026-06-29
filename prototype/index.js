import {state, clearState} from './src/state.js'
import {run} from './src/loop.js'
import {renderBegin, renderRunning, renderResume} from './src/views/screens.js'

const start = () => {
  state.phase = 'running'
  renderRunning() // mounts the components (they subscribe to the loop)
  run()           // starts the timer, the tick, and the activity wiring
}

const restart = () => {
  clearState()
  location.reload()
}

// a refresh always restarts the live timer at 0:
//  - never begun  -> BEGIN screen
//  - otherwise     -> resume screen with stats + continue / restart
if (state.phase === 'idle') {
  renderBegin(start)
} else {
  state.phase = 'resume'
  renderResume({onContinue: start, onRestart: restart})
}
