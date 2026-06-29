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
