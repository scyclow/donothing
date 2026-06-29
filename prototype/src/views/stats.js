import {createComponent} from '../../$.js'
import {formatTime} from '../formatTime.js'
import {state} from '../state.js'
import {timer} from '../models/timer.js'
import {onTick} from '../loop.js'
import {unlocked} from '../unlocks.js'

// best (live max) and cumulative total, revealed once their unlocks fire.
createComponent(
  'game-stats',
  `
    <style>
      :host { display: block }
      .hidden { display: none }
    </style>
    <div id="best" class="hidden"></div>
    <div id="total" class="hidden"></div>
  `,
  {best: '', total: ''},
  ctx => {
    ctx.$best = ctx.$('#best')
    ctx.$total = ctx.$('#total')
    onTick(() => {
      // visibility reacts to app state directly; setState carries only the text
      ctx.$best.classList.toggle('hidden', !unlocked('best'))
      ctx.$total.classList.toggle('hidden', !unlocked('total'))

      const elapsed = timer.elapsedMs()
      ctx.setState({
        best: formatTime(Math.max(state.bestMs, elapsed) / 1000),
        total: formatTime(state.cumulativeSec + Math.floor(elapsed / 1000)),
      })
    })
  },
  ctx => {
    ctx.$best.textContent = `best: ${ctx.state.best}`
    ctx.$total.textContent = `total: ${ctx.state.total}`
  },
)
