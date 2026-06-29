import {$, createComponent} from '../../$.js'
import {globalState,} from '../state.js'
import {onPause, onResume, onClear, onTick} from '../timer.js'
import {persist} from '../persist.js'



$.id('main').append($.fromHTML(`<nothing-timer></nothing-timer>`))


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
  persist('__DO_NOTHING_TIMER', {
    showBest: false
  }),
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
      ctx.setState({
        showBest: globalState.bestNothingTimeStreak > 2 && globalState.currentNothingTimeStreak < globalState.totalNothingTime
      }, true)


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


    ctx.$currentHeader.style.visibility = ctx.state.showBest ? 'visible' : 'hidden'

    ctx.$timer.innerHTML = formatTime(globalState.currentNothingTimeStreak)

    ctx.$bestStreak.innerHTML = formatTime(globalState.bestNothingTimeStreak)
    ctx.$bestStreakSection.style.display = ctx.state.showBest ? 'block' : 'none'

    ctx.$totalTime.innerHTML = formatTime(globalState.totalNothingTime)

    ctx.$totalTimeSection.style.display =
      ctx.state.showBest
      && globalState.bestNothingTimeStreak > 10
      && (
        globalState.totalNothingTime - 10 > globalState.currentNothingTimeStreak
        || globalState.totalNothingTime > 25
      )
        ? 'block'
        : 'none'


  },
)
