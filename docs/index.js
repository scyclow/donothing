import { veilDisplay } from './components/veil.js'
import { menuDisplay } from './components/menu.js'
import { $ } from './$.js'
import { globalState } from './state.js'
import { onTick } from './timer.js'

import './components/misc.js'
import './components/nothingTimer.js'
import './components/popup.js'



veilDisplay('veil')
menuDisplay('menu', 'menuControls', 'menuStats')

$.id('main').innerHTML = '<nothing-timer></nothing-timer>'


$.id('main').append($.fromHTML(`
<div style="width: 200px; height: 400px"></div>
  `))


/* TODO

  - Achievement module
    - visible after 30 seconds
    - initial achievement: do nothing for one minute straight (count down)
      - click to activate achievement prize: store module
      - triggers popup ~10 seconds later

    - achievement 2:00 streak
      - unlock stats (total streaks, total new high scores, total clears, time spent doing something (total time with window focused - total nothing time))



  - store module
    - buy ad blocker (toggle popups)
    - supercharge the $ box
    - buy a new $ box
    - upgrade $ box capacity
    - buy ability to keep $ generation on
    - buy more detailed stats (how many resets, time spent doing something)
    - night mode
    - screen savers (+ maybe actual screen savers when the game is paused)
    - change font
    - change colors
    - clock module

  - enable popups after 57 seconds
     - show one popup over time immediately
     - display a popup in random locations (without x going off screen) every ~30s +/- 10s

  - $ box module
    - [_] <- $
    -

  - ad blocker module
    - toggle popups on/off

*/


function mountMoneyPopup() {
  const moneyPopup = $.fromHTML(`
    <nothing-popup id="moneyPopup" x="15px" y="10px" width="200px" height="200px">
      <span style="font-size: 30px; cursor: pointer; font-family: var(--font2); font-weight: bold">CLICK <nothing-blink duration="750"><span style="text-decoration: underline">HERE</span></nothing-blink> TO START MAKING $ <em>NOW</em></span>
    </nothing-popup>
  `)

  moneyPopup.onClose(() => {
    globalState.moneyPopupDismissed = true
  })

  $.id('main').append(moneyPopup)
}

onTick(() => {
  if (!globalState.moneyPopupDisplayed && globalState.currentNothingTimeStreak >= 56) {
    mountMoneyPopup()
    globalState.moneyPopupDisplayed = true
  }
})

if (globalState.moneyPopupDisplayed && !globalState.moneyPopupDismissed) {
  mountMoneyPopup()
}

