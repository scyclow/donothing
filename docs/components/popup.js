import {createComponent} from '../$.js'
// import {globalState, onPause, onResume, onClear} from '../state.js'
// import {onTick} from '../timer.js'


createComponent(
  'nothing-popup',
  `
    <style>
      * {
        padding: 0;
        margin: 0;
      }

      #popup {
        border: 4px solid;
        display: inline-block;
        position: absolute;

        min-width: 50px;
        min-height: 50px;
        background: var(--bg-color);
        display: flex;
        flex-direction: column;
      }

      #xContainer {
        display: flex;
        justify-content: flex-end;
      }

      #x {
        cursor: pointer;
        font-weight: bold;
        position: absolute;
      }

      #content, #x {
        padding: 0.25em;
      }

      #content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
      }

    </style>

    <div id="popup">
      <div id="xContainer">
        <span id="x">X</span>
      </div>

      <div id="content">
        <slot></slot>
      </div>

    </div>
  `,
  {
    isOpen: true
  },
  ctx => {

    ctx.$('#popup').style.left = ctx.getAttribute('x')
    ctx.$('#popup').style.top = ctx.getAttribute('y')
    ctx.$('#popup').style.width = ctx.getAttribute('width')
    ctx.$('#popup').style.height = ctx.getAttribute('height')





    ctx.show = () => ctx.$('#popup').style.display = 'flex'
    ctx.hide = () => ctx.$('#popup').style.display = 'none'

    let onClose = () => {}
    ctx.onClose = (fn) => onClose = fn

    ctx.$('#x').onclick = () => {
      ctx.hide()
      onClose()
    }

  },
  ctx => {},
)