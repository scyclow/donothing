import {$, createComponent} from '../$.js'
import {ARROW_SVGS} from './misc.js'
import {globalState} from '../state.js'
import {onTick} from '../timer.js'

let earnId = null
let holdId = null
let isDown = false
let releasedAt = 0
let onEarnFn = () => {}

const hoverAllowed = () => !isDown && Date.now() - releasedAt >= 100

function earn() {
  globalState.balanceCents += 1
  onEarnFn()
  window.dispatchEvent(new CustomEvent('nothingEarned'))
}

function startEarning() {
  if (earnId) return
  earnId = setInterval(() => { if (hoverAllowed()) earn() }, 500)
}

function stopEarning() {
  clearInterval(earnId)
  earnId = null
}

function startHoldEarning() {
  isDown = true
  if (holdId) return
  holdId = setInterval(earn, 200)
}

function stopHoldEarning() {
  if (isDown) releasedAt = Date.now()
  isDown = false
  clearInterval(holdId)
  holdId = null
}

createComponent(
  'nothing-money-box',
  `
    <link rel="stylesheet" href="./index.css">
    <style>
      :host { display: block; }
      * { padding: 0; margin: 0; }
      #layout { display: flex; align-items: center; gap: 0.5em; margin: auto; }
      #prompt { font-size: 1.25em; display: flex; align-items: center; gap: 0.25em; }
      #box {
        width: 80px;
        height: 80px;
        border: 1px solid var(--border-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        -webkit-user-select: none;
      }
      #box:hover { background: var(--border-color); }
      #box:active { background: var(--accent-color); }
      #info { font-size: 11px; }
      #balance { font-weight: bold; margin-bottom: 0.25em; font-size: 12px; }
      #rates { white-space: pre; line-height: 1.6; }
    </style>
    <nothing-module legend="$ Box">
      <div id="layout">
        <div id="prompt"></div>
        <div id="box"></div>
        <div id="info">
          <div id="balance"></div>
          <div id="rates">click: $0.01
hover: $0.02/s
hold:  $0.05/s</div>
        </div>
      </div>
    </nothing-module>
  `,
  {},
  ctx => {
    onEarnFn = () => ctx.render()

    ctx.$('#prompt').innerHTML = `<nothing-blink duration="1000">$</nothing-blink>${ARROW_SVGS['→']}`

    const $box = ctx.$('#box')
    $box.addEventListener('click', earn)
    $box.addEventListener('mouseenter', startEarning)
    $box.addEventListener('mouseleave', () => { stopEarning(); stopHoldEarning() })
    $box.addEventListener('mousedown', startHoldEarning)
    $box.addEventListener('mouseup', stopHoldEarning)
  },
  ctx => {
    ctx.$('#balance').textContent = `$${(globalState.balanceCents / 100).toFixed(2)}`
  }
)
