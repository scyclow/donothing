import {createComponent} from '../../$.js'
import {onTick} from '../loop.js'
import {unlocked} from '../unlocks.js'
import {
  startEarning, stopEarning,
  startHoldEarning, stopHoldEarning,
  clickEarn, formatMoney, setOnEarn,
} from '../models/money.js'

// one box, three earners: click ($0.01), hover ($0.02/s), hold ($0.04/s).
createComponent(
  'money-box',
  `
    <style>
      :host { display: block }
      .hidden { display: none }
      #rates { white-space: pre }

      #box {
        width: 100px;
        height: 100px;
        transition: 150ms;
        cursor: pointer;
        border: 1px solid var(--text-color);
      }
      #box:hover {
        background: var(--border-color);
        border-color: var(--border-color);
      }
      #box:active {
        background: var(--accent-color);
        border-color: var(--accent-color);
      }
    </style>

    <div id="root" class="hidden">
      <div id="balance"></div>
      <div id="rates">click: $0.01
hover: $0.02/s
hold:  $0.04/s</div>
      <div id="box"></div>
    </div>
  `,
  {balance: '$0.00'},
  ctx => {
    ctx.$root = ctx.$('#root')
    ctx.$balance = ctx.$('#balance')

    const box = ctx.$('#box')
    box.addEventListener('click', clickEarn)
    box.addEventListener('mouseenter', startEarning)
    box.addEventListener('mousedown', startHoldEarning)
    box.addEventListener('mouseup', stopHoldEarning)
    box.addEventListener('mouseleave', () => { stopEarning(); stopHoldEarning() })

    // repaint the balance the instant a cent lands, not just on the loop tick
    setOnEarn(() => ctx.setState({balance: formatMoney()}))

    onTick(() => {
      ctx.$root.classList.toggle('hidden', !unlocked('money'))
      ctx.setState({balance: formatMoney()})
    })
  },
  ctx => { ctx.$balance.textContent = ctx.state.balance },
)
