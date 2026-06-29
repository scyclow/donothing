import {$} from '../$.js'
import {DEV_MODE} from '../state.js'
import {onPause, onResume} from '../timer.js'


export const veilDisplay = (id, controlsId, statsId) => {
  const v = $.id(id)
  const controls = $.id(controlsId)
  const stats = $.id(statsId)



  const hideVeil = (...a) => {
    v.style.opacity = 0
    v.style.pointerEvents = 'none'

  }

  const showVeil = (...a) => {
    if (globalState.gameStarted && !globalState.gameStopped && !DEV_MODE) {
      v.style.opacity = 1
      v.style.pointerEvents = 'all'
    }
  }


  onPause(showVeil)
  onResume(hideVeil)


}