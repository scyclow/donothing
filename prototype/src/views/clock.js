import {createComponent} from '../../$.js'
import {formatTime} from '../formatTime.js'
import {timer} from '../models/timer.js'
import {onTick} from '../loop.js'

// the live do-nothing counter, top-left.
createComponent(
  'game-clock',
  `
    <style>:host { display: block }</style>
    <div id="t">0 seconds</div>
  `,
  {text: '0 seconds'},
  ctx => {
    ctx.$t = ctx.$('#t')
    onTick(() => ctx.setState({text: formatTime(timer.elapsedMs() / 1000)}))
  },
  ctx => { ctx.$t.textContent = ctx.state.text },
)
