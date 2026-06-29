import {$, ls} from '../$.js'
import {globalState, continueGame, startGame} from '../state.js'
import {haltPersistence} from '../persist.js'
import {openCtx} from '../audio.js'



export const menuDisplay = (id, controlsId, statsId) => {
  const m = $.id(id)
  const $controls = $.id(controlsId)
  const $stats = $.id(statsId)


  if (!globalState.gameStarted) {

    $controls.innerHTML = '<button id="startGame">Start</button>'

    const _startGame = () => {
      $.id('startGame').removeEventListener('click', startGame)
      m.remove()
      openCtx()
      startGame()
    }

    $.id('startGame').addEventListener('click', _startGame)


  } else if (globalState.gameStopped) {
    $controls.innerHTML = '<button id="continueGame">Continue</button><button id="restartGame">Restart</button>'

    const _continueGame = () => {
      $.id('continueGame').removeEventListener('click', _continueGame)
      m.remove()
      openCtx()
      continueGame()
    }

    $.id('continueGame').addEventListener('click', _continueGame)

    $.id('restartGame').addEventListener('click', () => {
      haltPersistence()
      localStorage.clear()
      location.reload()
    })


    $stats.innerHTML = `
      <div>Best Time: ${formatTime(globalState.bestNothingTimeStreak)}</div>
      <div>Total Time: ${formatTime(globalState.totalNothingTime)}</div>
    `
  }

}