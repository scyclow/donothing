export const forceResume = (c) => {
  if (c.state === 'interrupted' || c.state === 'suspended') {
    c.resume()
  }
}

export const MAX_VOLUME = 0.04


let sharedAudioContext
function getAudioContext() {
  if (!sharedAudioContext) {
    // Hack to get this shit to work on iphone
    try {
      if (navigator.audioSession) {
        navigator.audioSession.type = 'playback'
      }
    } catch (e) {
      console.log(e)
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext
    sharedAudioContext = new AudioContext()
    sharedAudioContext.onstatechange = () => forceResume(sharedAudioContext)
    forceResume(sharedAudioContext)
  }
  return sharedAudioContext
}

export function createSource(waveType = 'square', startingFreq=3000) {
  const ctx = getAudioContext()

  const source = ctx.createOscillator()
  const gain = ctx.createGain()
  const panner = new StereoPannerNode(ctx)

  source.connect(gain)
  gain.connect(panner)
  panner.connect(ctx.destination)

  gain.gain.value = 0
  source.type = waveType
  source.frequency.value = startingFreq
  source.start()

  const smoothFreq = (value, timeInSeconds=0.001) => {
    source.frequency.exponentialRampToValueAtTime(
      value,
      ctx.currentTime + timeInSeconds
    )
  }

  const smoothPanner = (value, timeInSeconds=0.001) => {
    panner.pan.exponentialRampToValueAtTime(
      value,
      ctx.currentTime + timeInSeconds
    )
  }

  let volume = 0
  const smoothGain = (value, timeInSeconds=0.001) => {
    volume = value || 0

    gain.gain.setTargetAtTime(
      Math.min(value, MAX_VOLUME),
      ctx.currentTime,
      timeInSeconds
    )
  }

  const mute = () => {
    gain.gain.setTargetAtTime(
      Math.min(0, MAX_VOLUME),
      ctx.currentTime,
      0.001
    )
  }
  const unmute = () => {
    gain.gain.setTargetAtTime(
      Math.min(volume, MAX_VOLUME),
      ctx.currentTime,
      0.001
    )
  }

  const src = {
    source, gain, panner,smoothFreq, smoothGain, smoothPanner, originalSrcType: source.type, mute, unmute, ctx,
    stop() {
      source.stop()
      this.isStopped = true
    }
  }


  return src
}

export const openCtx = () => SoundSrc.allSrcs.forEach(src => src.openCtx())

export class SoundSrc {
  static allSrcs = []
  constructor(waveType='sine', startingFreq=440) {
    SoundSrc.allSrcs.push(this)

    this.waveType =  waveType
    this.smoothFreq = startingFreq
    this.opened = false
  }

  openCtx() {
    if (!this.opened) {
      Object.assign(this, createSource(this.waveType, this.startingFreq))
      this.opened = true
    }
  }

  max() {
    if (!this.opened) return
    this.smoothGain(MAX_VOLUME)
  }

  silent() {
    if (!this.opened) return
    this.smoothGain(0)
  }

  async note(freq, ms, volume=MAX_VOLUME) {
    if (!this.opened) return
    forceResume(this.ctx)
    this.smoothGain(volume)
    this.smoothFreq(freq)
    await waitPromise(ms)
    this.smoothGain(0)
  }

  play(freq, v=1) {
    if (!this.opened) return
    forceResume(this.ctx)
    this.smoothGain(Math.min(v, 1) * MAX_VOLUME)
    this.smoothFreq(freq)
  }

  pause() {
    if (!this.opened) return
    this.smoothGain(0)
  }
}


