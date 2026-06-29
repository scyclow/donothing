import {createComponent} from '../../$.js'
// import {globalState, onPause, onResume, onClear} from '../state.js'
// import {onTick} from '../timer.js'


createComponent(
  'nothing-module',
  `
    <style>
      :host { display: block; }
      * {
        padding: 0;
        margin: 0;
      }

      #nothingModule {
        padding: 0.5em;
        padding-top: 1em;
        border: 1px solid var(--border-color);

        box-sizing: border-box;
        min-width: 220px;
        max-width: 288px;
        min-height: 145px;

        display: flex;
        flex-direction: column;
      }

      #content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .titleContainer {
        transform: translateY(-1.75em);
        display: inline-block;
        position: absolute;
      }

      #legend {
        background: var(--bg-color);
        padding: 0 0.25em;
      }

    </style>

    <section id="nothingModule">
      <div class="titleContainer">
        <h4 id="legend"></h4>
      </div>
      <div id="content">
        <slot></slot>
      </div>
    </section>
  `,
  {},
  ctx => {
    ctx.$('#legend').innerHTML = ctx.getAttribute('legend')
  },
)