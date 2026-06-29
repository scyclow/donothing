import { veilDisplay } from './components/veil.js'
import { menuDisplay } from './components/menu.js'
import { $ } from './$.js'
import { globalState } from './state.js'
import { onTick } from './timer.js'

import './components/misc.js'
import './components/nothingModule.js'
import './components/nothingTimer.js'
import './components/popup.js'
import './components/achievements.js'
import './components/nothingStats.js'
import './components/nothingStore.js'
import './components/nothingMoneyBox.js'
import './components/nothingAdBlocker.js'



veilDisplay('veil')
menuDisplay('menu', 'menuControls', 'menuStats')


// -- Module mounting --

function mountIfMissing(id, tag) {
  if (!$.id(id)) {
    $.id('main').append($.fromHTML(`<${tag} id="${id}"></${tag}>`))
  }
}

function checkModules() {
  if (globalState.storeUnlocked) mountIfMissing('nothingStore', 'nothing-store')
  if (globalState.statsUnlocked) mountIfMissing('nothingStats', 'nothing-stats')
  if (globalState.moneyBoxUnlocked) mountIfMissing('nothingMoneyBox', 'nothing-money-box')
  if (globalState.adBlockerUnlocked) mountIfMissing('nothingAdBlocker', 'nothing-ad-blocker')
}

checkModules()
onTick(checkModules)
window.addEventListener('nothingModuleUnlocked', checkModules)


// -- Popup logic --

function mountMoneyPopup() {
  const width = 200
  const height = 200
  const x = Math.floor(Math.random() * (window.innerWidth - width))
  const y = Math.floor(Math.random() * (window.innerHeight - height))

  const moneyPopup = $.fromHTML(`
    <nothing-popup x="${x}px" y="${y}px" width="${width}px" height="${height}px">
      <span style="font-size: 30px; cursor: pointer; font-family: var(--font2); font-weight: bold">CLICK <nothing-blink duration="750"><span style="text-decoration: underline">HERE</span></nothing-blink> TO START MAKING $ <em>NOW</em></span>
    </nothing-popup>
  `)

  moneyPopup.onClose(() => {
    globalState.moneyPopupDismissed = true
  })

  $.id('main').append(moneyPopup)
}

let popupScheduled = false

function scheduleNextPopup() {
  if (popupScheduled) return
  popupScheduled = true
  const run = () => {
    const delay = (20 + Math.random() * 20) * 1000
    setTimeout(() => {
      if (!globalState.adBlockerEnabled) mountMoneyPopup()
      run()
    }, delay)
  }
  run()
}

function showFirstPopup() {
  if (globalState.moneyPopupDisplayed) return
  mountMoneyPopup()
  globalState.moneyPopupDisplayed = true
  scheduleNextPopup()
}

// Rehydration: restore popup state from previous session
if (globalState.moneyPopupDisplayed && !globalState.moneyPopupDismissed) {
  mountMoneyPopup()
}
if (globalState.moneyPopupDisplayed) {
  scheduleNextPopup()
}

// Fallback trigger at 57s in case achievement hasn't been claimed yet
onTick(() => {
  if (!globalState.moneyPopupDisplayed && globalState.currentNothingTimeStreak >= 57) {
    showFirstPopup()
  }
})

// Achievement 0 claim triggers first popup after 10s
window.addEventListener('nothingAchievementClaimed', e => {
  if (e.detail === '0') setTimeout(showFirstPopup, 10000)
})
