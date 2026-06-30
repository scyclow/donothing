import { $ } from '../$.js'
import { globalState } from '../state.js'
import {createComponent} from '../$.js'
import {onTick, onClear} from '../timer.js'



function showAchievements() {
  $.id('main').append($.fromHTML(`
    <nothing-achievements></nothing-achievements>
  `))


  globalState.achievementsDisplayed = true
}


if (globalState.achievementsDisplayed) showAchievements()

onTick((s, t) => {
  if ((s >= 30 || t >= 60) && !globalState.achievementsDisplayed) showAchievements()
})






createComponent(
  'nothing-achievements',
  `
    <link rel="stylesheet" href="./index.css">
    <style>
      * {
        padding: 0;
        margin: 0;
      }

      .achievementItem {
        font-size: 12px;
      }

      .hidden {
        display: none;
      }



    </style>

    <nothing-module legend="Achievements">
      <div id="achievements"></div>
    </nothing-module>
  `,
  {},
  ctx => {
    onTick(() => ctx.render())
    onClear(() => ctx.render())

    const $achievements = ctx.$('#achievements')

    const rows = Object.entries(globalState.achievementList).map(([id, a]) => {
      const claim = $.fromHTML(`
        <button>Claim achievement</button>
      `)

      claim.onclick = () => {
        a.claimed = true
        ctx.render()
      }

      return $.div([
        $.span(),
        claim
      ], {
        'class': 'achievementItem',
        id: `achievement-${id}`
      })
    })

    $.render($achievements, rows)
  },

  ctx => {
    Object.entries(globalState.achievementList).forEach(([id, a]) => {
      const $row = ctx.$(`#achievement-${id}`)
      if (!$row) return

      if (a.claimed || !a.displayed) {
        $row.classList.add('hidden')
      } else {
        $row.classList.remove('hidden')

        const $display = $row.querySelector('span')
        const $claim = $row.querySelector('button')

        if (a.completed) {
          $display.classList.add('hidden')
          $claim.classList.remove('hidden')
        } else {
          $display.innerHTML = a.display()
          $display.classList.remove('hidden')
          $claim.classList.add('hidden')
        }
      }
    })
  },
)