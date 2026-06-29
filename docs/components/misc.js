import {createComponent} from '../$.js'

const defineAnimatingComponent =(tag, animName, keyframesCss, easing='linear', defaultDuration=2000) => {
  createComponent(
    tag,
    `
      <style>
        :host { display: inline-block; }
        #wrapper {
          animation-name: ${animName};
          animation-iteration-count: infinite;
        }
        ${keyframesCss}
      </style>
      <div id="wrapper"><slot></slot></div>
    `,
    {},
    ctx => {},
    ctx => {
      const wrapper = ctx.$('#wrapper')
      if (!wrapper) return

      const duration = Number(ctx.getAttribute('duration') || defaultDuration)
      const delay = -1 * Number(ctx.getAttribute('delay') || 0)
      const direction = Number(ctx.getAttribute('direction') || 1)
      const timingFunction = ctx.getAttribute('timing-function') || easing

      wrapper.style.animationDuration = `${duration}ms`
      wrapper.style.animationDelay = `${delay}ms`
      wrapper.style.animationDirection = direction === -1 ? 'reverse' : 'normal'
      wrapper.style.animationTimingFunction = timingFunction
    }
  )
}


defineAnimatingComponent('nothing-blink', 'Blink', `
  @keyframes Blink {
    to { visibility: hidden; }
  }
`, 'steps(2, start)', 1500)

const arrowSvg = (rotation) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 47" fill="var(--text-color)" stroke="var(--text-color)" style="display:inline-block;width:0.825em;height:0.5em;vertical-align:0.1em;transform:rotate(${rotation}deg)"><path d="M54.5 19.207H0.5V27.707H54.5V45.707L77 23.707L54.5 1.20703V19.207Z"/></svg>`

export const ARROW_SVGS = {
  '→': arrowSvg(0),
  '←': arrowSvg(180),
  '↓': arrowSvg(90),
  '↑': arrowSvg(-90),
}
