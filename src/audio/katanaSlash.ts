/** Procedural katana slash — whoosh + metallic ring via Web Audio */
export function playKatanaSlash() {
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return

  const ctx = new AudioCtx()
  const now = ctx.currentTime
  const master = ctx.createGain()
  master.gain.value = 0.55
  master.connect(ctx.destination)

  // Air whoosh (filtered noise sweep)
  const whooshDur = 0.28
  const noiseBuf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * whooshDur), ctx.sampleRate)
  const data = noiseBuf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length
    const envelope = Math.sin(Math.PI * Math.min(1, t * 2.2)) * (1 - t) ** 0.35
    data[i] = (Math.random() * 2 - 1) * envelope
  }
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuf
  const whooshFilter = ctx.createBiquadFilter()
  whooshFilter.type = 'bandpass'
  whooshFilter.Q.value = 0.7
  whooshFilter.frequency.setValueAtTime(400, now)
  whooshFilter.frequency.exponentialRampToValueAtTime(4200, now + 0.12)
  whooshFilter.frequency.exponentialRampToValueAtTime(900, now + whooshDur)
  const whooshGain = ctx.createGain()
  whooshGain.gain.setValueAtTime(0.0001, now)
  whooshGain.gain.exponentialRampToValueAtTime(0.9, now + 0.02)
  whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + whooshDur)
  noise.connect(whooshFilter)
  whooshFilter.connect(whooshGain)
  whooshGain.connect(master)
  noise.start(now)
  noise.stop(now + whooshDur + 0.02)

  // Blade “shing” — layered high partials
  const shing = (freq: number, delay: number, gainAmt: number, dur: number) => {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(freq, now + delay)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.55, now + delay + dur)

    const filt = ctx.createBiquadFilter()
    filt.type = 'highpass'
    filt.frequency.value = 1200
    filt.Q.value = 0.8

    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, now + delay)
    g.gain.exponentialRampToValueAtTime(gainAmt, now + delay + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur)

    osc.connect(filt)
    filt.connect(g)
    g.connect(master)
    osc.start(now + delay)
    osc.stop(now + delay + dur + 0.02)
  }

  shing(2400, 0.02, 0.22, 0.22)
  shing(3600, 0.035, 0.14, 0.18)
  shing(5200, 0.05, 0.08, 0.14)

  // Soft metallic ring tail
  const ring = ctx.createOscillator()
  ring.type = 'sine'
  ring.frequency.setValueAtTime(1750, now + 0.06)
  ring.frequency.exponentialRampToValueAtTime(880, now + 0.45)
  const ringGain = ctx.createGain()
  ringGain.gain.setValueAtTime(0.0001, now + 0.06)
  ringGain.gain.exponentialRampToValueAtTime(0.12, now + 0.08)
  ringGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)
  ring.connect(ringGain)
  ringGain.connect(master)
  ring.start(now + 0.06)
  ring.stop(now + 0.55)

  window.setTimeout(() => {
    void ctx.close()
  }, 700)
}
