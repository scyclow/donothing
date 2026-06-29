import {createComponent} from '../../$.js'
import {globalState,} from '../state.js'
import {onPause, onResume, onClear} from '../timer.js'
import {onTick} from '../timer.js'


createComponent(
  'nothing-timer',
  `
    <style>
      :host { display: block }
      * {
        padding: 0;
        margin: 0;
      }
      h2 {
        text-transform: uppercase;
        font-size: 10px;
        letter-spacing: 2px;
        font-weight: bold;
      }

      section {
        padding: 0.25em;
      }

      section + section {
        margin-top: 0.5em;
      }
    </style>
    <div id="nothingTimer">
      <section>
        <h2 id="currentHeader">Current</h2>
        <div id="timer"></div>
      </section>

      <section id="bestStreakSection">
        <h2>Best</h2>
        <div id="bestStreak"></div>
      </section>


      <section id="totalTimeSection">
        <h2>Total</h2>
        <div id="totalTime"></div>
      </section>
    </div>
  `,
  {},
  ctx => {
    ctx.$nothingTimer = ctx.$('#nothingTimer')
    ctx.$timer = ctx.$('#timer')
    ctx.$bestStreak = ctx.$('#bestStreak')
    ctx.$bestStreakSection = ctx.$('#bestStreakSection')
    ctx.$totalTime = ctx.$('#totalTime')
    ctx.$totalTimeSection = ctx.$('#totalTimeSection')
    ctx.$currentHeader = ctx.$('#currentHeader')


    onTick(() => ctx.render())
    onClear(() => {
      ctx.render()


      if (globalState.currentNothingTimeStreak > 0) {
        ctx.$nothingTimer.style.background = 'var(--warning-color)'
        ctx.$nothingTimer.style.color = 'var(--warning-color)'
        setTimeout(() => {
          ctx.$nothingTimer.style.background = 'var(--bg-color)'
          ctx.$nothingTimer.style.color = 'var(--text-color)'
        }, 150)
      }
    })



  },
  ctx => {
    const showBest = globalState.bestNothingTimeStreak > 2
      && globalState.currentNothingTimeStreak < globalState.totalNothingTime


    ctx.$currentHeader.style.visibility = showBest ? 'visible' : 'hidden'

    ctx.$timer.innerHTML = formatTime(globalState.currentNothingTimeStreak)

    ctx.$bestStreak.innerHTML = formatTime(globalState.bestNothingTimeStreak)
    ctx.$bestStreakSection.style.display = showBest ? 'block' : 'none'

    ctx.$totalTime.innerHTML = formatTime(globalState.totalNothingTime)

    ctx.$totalTimeSection.style.display =
      showBest
      && globalState.bestNothingTimeStreak > 10
      && (
        globalState.totalNothingTime - 10 > globalState.currentNothingTimeStreak
        || globalState.totalNothingTime > 25
      )
        ? 'block'
        : 'none'


  },
)
