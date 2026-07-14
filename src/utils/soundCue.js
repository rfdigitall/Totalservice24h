let played = false

export function playRadioCue() {
  if (played || typeof window === 'undefined') return
  played = true

  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()

    const resume = () => {
      if (ctx.state === 'suspended') ctx.resume()
    }
    resume()

    const now = ctx.currentTime
    const duration = 0.18

    const noise = ctx.createBufferSource()
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3))
    }
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1200
    filter.Q.value = 2

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    const tone = ctx.createOscillator()
    tone.type = 'sine'
    tone.frequency.setValueAtTime(880, now)
    tone.frequency.exponentialRampToValueAtTime(440, now + 0.08)

    const toneGain = ctx.createGain()
    toneGain.gain.setValueAtTime(0.0001, now)
    toneGain.gain.exponentialRampToValueAtTime(0.03, now + 0.01)
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    tone.connect(toneGain)
    toneGain.connect(ctx.destination)

    noise.start(now)
    tone.start(now)
    tone.stop(now + 0.12)
    noise.stop(now + duration)

    setTimeout(() => ctx.close(), 500)
  } catch {
    // Audio not available — silent fallback
  }
}
