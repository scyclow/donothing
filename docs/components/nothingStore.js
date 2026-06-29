import {$, createComponent} from '../$.js'
import {globalState} from '../state.js'
import {onTick} from '../timer.js'

const ITEMS = [
  {
    id: 'adBlocker',
    name: 'Ad Blocker',
    description: 'toggle popups on/off',
    price: 100,
    purchased: () => globalState.adBlockerUnlocked,
    buy() { globalState.adBlockerUnlocked = true }
  }
]

createComponent(
  'nothing-store',
  `
    <link rel="stylesheet" href="./index.css">
    <style>
      :host { display: block; }
      * { padding: 0; margin: 0; }
      #balance { font-size: 12px; margin-bottom: 0.5em; }
      .item { font-size: 12px; display: flex; justify-content: space-between; align-items: center; gap: 1em; }
      .item + .item { margin-top: 0.5em; }
      .item-name { font-weight: bold; }
      .item-desc { opacity: 0.7; font-size: 11px; }
      .hidden { display: none; }
    </style>
    <nothing-module legend="Store">
      <div id="balance"></div>
      <div id="items"></div>
    </nothing-module>
  `,
  {},
  ctx => {
    onTick(() => ctx.render())
    window.addEventListener('nothingEarned', () => ctx.render())

    ITEMS.forEach(item => {
      const $btn = $.fromHTML(`<button>$${(item.price / 100).toFixed(2)}</button>`)
      $btn.addEventListener('click', () => {
        if (globalState.balanceCents >= item.price && !item.purchased()) {
          globalState.balanceCents -= item.price
          item.buy()
          window.dispatchEvent(new CustomEvent('nothingModuleUnlocked'))
          ctx.render()
        }
      })

      ctx.$('#items').append($.div([
        $.div([
          $.div(item.name, {'class': 'item-name'}),
          $.div(item.description, {'class': 'item-desc'}),
        ]),
        $btn
      ], {'class': 'item', 'data-item': item.id}))
    })
  },
  ctx => {
    ctx.$('#balance').textContent = `Balance: $${(globalState.balanceCents / 100).toFixed(2)}`

    ITEMS.forEach(item => {
      const $item = ctx.$(`[data-item="${item.id}"]`)
      if (!$item) return
      const purchased = item.purchased()
      $item.classList.toggle('hidden', purchased)
      if (!purchased) {
        $item.querySelector('button').disabled = globalState.balanceCents < item.price
      }
    })
  }
)
