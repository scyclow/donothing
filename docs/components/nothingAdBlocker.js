import {$, createComponent} from '../$.js'
import {globalState} from '../state.js'

createComponent(
  'nothing-ad-blocker',
  `
    <link rel="stylesheet" href="./index.css">
    <style>
      :host { display: block; }
      * { padding: 0; margin: 0; }
      #status { font-size: 12px; margin-bottom: 0.25em; }
    </style>
    <nothing-module legend="Ad Blocker">
      <div id="status"></div>
      <button id="toggle"></button>
    </nothing-module>
  `,
  {},
  ctx => {
    ctx.$('#toggle').addEventListener('click', () => {
      globalState.adBlockerEnabled = !globalState.adBlockerEnabled
      ctx.render()
    })
  },
  ctx => {
    ctx.$('#status').textContent = `Popups: ${globalState.adBlockerEnabled ? 'OFF' : 'ON'}`
    ctx.$('#toggle').textContent = globalState.adBlockerEnabled ? 'Disable' : 'Enable'
  }
)
