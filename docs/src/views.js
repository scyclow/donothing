import {$, createComponent} from '../$.js'
import {formatTime} from './formatTime.js'
import {state} from './state.js'
import {getResets} from './clock.js'
import {startEarning, stopEarning, startHoldEarning, stopHoldEarning, clickEarn, formatMoney, setOnEarn} from './money.js'
import {dev} from './dev.js'

const app = () => document.getElementById('app')
const button = $.create('button')

// the running screen as a web component. update() runs every clock tick, but
// setState() only re-renders when a displayed value changed (shallow deepEquals),
// so the 250ms ticks within a given second are no-ops.
//
// gating: best shows once total nothing >= 1s AND the clock was reset this run;
// total shows on the second reset.
createComponent(
  'running-view',
  `
    <style>
      * {
        padding: 0;
        margin: 0;
      }
      .hidden { display: none }

      #rates { white-space: pre }

      #money-box {
        width: 100px;
        height: 100px;
        transition: 150ms;
        cursor: pointer;
        border: 1px solid var(--text-color);
      }
      #money-box:hover {
        background: var(--border-color);
        border-color: var(--border-color);
      }
      #money-box:active {
        background: var(--accent-color);
        border-color: var(--accent-color);
      }
    </style>

    <div id="clock">0 seconds</div>
    <div id="best" class="hidden"></div>
    <div id="cumulative" class="hidden"></div>
    <div id="money" class="hidden">
      <div id="balance"></div>
      <div id="rates">click: $0.01
hover: $0.02/s
hold:  $0.04/s</div>
      <div id="money-box"></div>
    </div>
  `,
  {
    clock: '0 seconds',
    best: '',
    total: '',
    balance: '$0.00',
  },
  ctx => {
    ctx.$clock = ctx.$('#clock')
    ctx.$best = ctx.$('#best')
    ctx.$cumulative = ctx.$('#cumulative')
    ctx.$money = ctx.$('#money')
    ctx.$balance = ctx.$('#balance')

    // one box, all three earners: click ($0.01), hover ($0.04/s), hold ($0.08/s)
    const moneyBox = ctx.$('#money-box')
    moneyBox.addEventListener('click', clickEarn)
    moneyBox.addEventListener('mouseenter', startEarning)
    moneyBox.addEventListener('mousedown', startHoldEarning)
    moneyBox.addEventListener('mouseup', stopHoldEarning)
    moneyBox.addEventListener('mouseleave', () => { stopEarning(); stopHoldEarning() })

    // repaint the balance on every cent, not just on the clock tick
    setOnEarn(() => ctx.setState({balance: formatMoney()}))

    ctx.reveal = () => {
      if (state.bestUnlocked) {
        ctx.$best.classList.remove('hidden')
      }
      if (state.totalUnlocked) {
        ctx.$cumulative.classList.remove('hidden')
      }
      if (state.moneyUnlocked) {
        ctx.$money.classList.remove('hidden')
      }
    }

    ctx.update = elapsedMs => {
      const total = state.cumulativeSec + Math.floor(elapsedMs / 1000)
      ctx.setState({
        clock: formatTime(elapsedMs / 1000),
        best: formatTime(Math.max(state.bestMs, elapsedMs) / 1000),
        total: formatTime(total),
        balance: formatMoney(),
      })
    }


    ctx.reveal()
  },
  ctx => {
    const s = ctx.state

    ctx.$clock.textContent = s.clock
    ctx.$best.textContent = `best: ${s.best}`
    ctx.$cumulative.textContent = `total: ${s.total}`
    ctx.$balance.textContent = s.balance

    ctx.reveal()
  },
)

export const renderBegin = onBegin => {
  const root = app()
  root.innerHTML = ''
  const btn = button('BEGIN')
  btn.addEventListener('click', onBegin)
  root.append(btn)
}

// mounts the running-view component and returns it so the clock can drive update()
export const renderRunning = () => {
  const root = app()
  root.innerHTML = ''
  const view = document.createElement('running-view')
  root.append(view)
  return view
}

export const renderResume = ({onContinue, onRestart}) => {
  const root = app()
  // only show best once total nothing has reached 1s (matches the running gate)
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

// blackout overlay: 1 while the page is inactive, 0 while active.
// stats are committed by the time we pause, so they're current here.
export const setVeil = active => {
  if (dev) return // dev mode never blacks out the screen
  if (active) {
    document.getElementById('veil-best').textContent = `best: ${formatTime(state.bestMs / 1000)}`
    document.getElementById('veil-total').textContent = `total nothing: ${formatTime(state.cumulativeSec)}`
  }
  $(document.getElementById('veil'), 'opacity', active ? '1' : '0')
}
