import {$} from '../../$.js'
import {formatTime} from '../formatTime.js'
import {state} from '../state.js'
import './clock.js'
import './stats.js'
import './moneyBox.js'

const app = () => document.getElementById('app')
const button = $.create('button')

export const renderBegin = onBegin => {
  app().innerHTML = ''
  const btn = button('BEGIN')
  btn.addEventListener('click', onBegin)
  app().append(btn)
}

// the running screen is just the three self-driving components as siblings;
// each subscribes to the loop and renders itself.
export const renderRunning = () => {
  app().innerHTML = '<game-clock></game-clock><game-stats></game-stats><money-box></money-box>'
}

export const renderResume = ({onContinue, onRestart}) => {
  const root = app()
  // only show best once total nothing has reached 1s
  const best = state.cumulativeSec >= 1 ? `<p>best: ${formatTime(state.bestMs / 1000)}</p>` : ''
  root.innerHTML = `
    ${best}
    <p>total nothing: ${formatTime(state.cumulativeSec)}</p>
  `
  const cont = button('CONTINUE')
  const restart = button('RESTART')
  cont.addEventListener('click', onContinue)
  restart.addEventListener('click', onRestart)
  root.append(cont, restart)
}
