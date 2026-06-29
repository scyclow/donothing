import {$} from '../../$.js'
import {formatTime} from '../formatTime.js'
import {state} from '../state.js'
import {dev} from '../dev.js'

// blackout overlay: opacity 1 while the page is inactive, 0 while active.
// stats are committed by the time we pause, so they're current here.
export const setVeil = active => {
  if (dev) return // dev mode never blacks out the screen
  if (active) {
    document.getElementById('veil-best').textContent = `best: ${formatTime(state.bestMs / 1000)}`
    document.getElementById('veil-total').textContent = `total nothing: ${formatTime(state.cumulativeSec)}`
  }
  $(document.getElementById('veil'), 'opacity', active ? '1' : '0')
}
