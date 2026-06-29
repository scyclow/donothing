import {createComponent} from '../$.js'
import {globalState} from '../state.js'
import {onTick, onClear} from '../timer.js'

createComponent(
  'nothing-stats',
  `
    <style>
      :host { display: block; }
      * { padding: 0; margin: 0; }
      .row { font-size: 12px; }
      .row + .row { margin-top: 0.25em; }
    </style>
    <nothing-module legend="Stats">
      <div id="stats"></div>
    </nothing-module>
  `,
  {},
  ctx => {
    onTick(() => ctx.render())
    onClear(() => ctx.render())
  },
  ctx => {
    const doing = globalState.totalSeconds - globalState.totalNothingTime
    ctx.$('#stats').innerHTML = `
      <div class="row">Best streak: ${formatTime(globalState.bestNothingTimeStreak)}</div>
      <div class="row">Total nothing: ${formatTime(globalState.totalNothingTime)}</div>
      <div class="row">Doing something: ${formatTime(doing)}</div>
      <div class="row">Clears: ${globalState.totalClears}</div>
      <div class="row">Last streak: ${formatTime(globalState.lastTimeStreak)}</div>
    `
  }
)
