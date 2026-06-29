import {createComponent} from '../../$.js'
// import {globalState, onPause, onResume, onClear} from '../state.js'
// import {onTick} from '../timer.js'


createComponent(
  'nothing-module',
  `
    <style>
      * {
        padding: 0;
        margin: 0;
      }

      #nothingModule {
        margin-top: 0.5em;
        padding: 0.5em;
        padding-top: 1em;
        border: 1px solid var(--border-color);

        box-sizing: border-box;
        min-width: 220px;
        max-width: 288px;
        min-height: 145px;
      }

      .titleContainer {
        transform: translateY(-1.75em);
        display: inline-block;
        position: absolute;
      }

      #title {
        background: var(--bg-color);
        padding: 0 0.25em;
      }

    </style>

    <section id="nothingModule">
      <div class="titleContainer">
        <h4 id="title"></h4>
      </div>
      <slot></slot>
    </section>
  `,
  {},
  ctx => {
    ctx.$('#title').innerHTML = ctx.getAttribute('title')
  },
)