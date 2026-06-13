export default class SoundManager {
  constructor() {
    this.ctx = null
    this.sfxGain = null
    this.bgmAudio = null
    this.isMuted = false
    this.currentMusic = null
  }

  init() {
    if (this.ctx) return
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    this.sfxGain = this.ctx.createGain()
    this.sfxGain.gain.value = 1.0
    this.sfxGain.connect(this.ctx.destination)
  }

  playMusic(file, loop = true) {
    if (this.currentMusic === file && this.bgmAudio) {
      this.bgmAudio.play().catch(() => {})
      return
    }
    this.stopBGM()
    const audio = new Audio(`/sounds/${file}`)
    audio.loop = loop
    audio.volume = this.isMuted ? 0 : 0.5
    audio.play().catch(() => {})
    this.bgmAudio = audio
    this.currentMusic = file
  }

  startBGM() {
    this.playMusic('music-game.mp3')
  }

  playMenuMusic() {
    this.playMusic('music-menu.mp3')
  }

  playGameOverMusic() {
    this.stopBGM()
    this.currentMusic = null
    const audio = new Audio('/sounds/music-gameover.mp3')
    audio.loop = false
    audio.volume = this.isMuted ? 0 : 0.5
    audio.play().catch(() => {})
    this.bgmAudio = audio
  }

  pauseBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause()
    }
  }

  resumeBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.play().catch(() => {})
    }
  }

  stopBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause()
      this.bgmAudio.currentTime = 0
      this.bgmAudio = null
      this.currentMusic = null
    }
  }

  playHit() {
    if (!this.ctx || this.isMuted) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.connect(gain)
    gain.connect(this.sfxGain)
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(400, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.4)
    gain.gain.setValueAtTime(1.0, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.4)
  }

  playPowerup() {
    if (!this.ctx || this.isMuted) return
    const notes = [523, 659, 784, 1047]
    notes.forEach((note, i) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.connect(gain)
      gain.connect(this.sfxGain)
      osc.type = 'sine'
      osc.frequency.value = note
      gain.gain.setValueAtTime(0.8, this.ctx.currentTime + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.2)
      osc.start(this.ctx.currentTime + i * 0.08)
      osc.stop(this.ctx.currentTime + i * 0.08 + 0.2)
    })
  }

  playLevelUp() {
    if (!this.ctx || this.isMuted) return
    const notes = [523, 659, 784, 1047]
    notes.forEach((note, i) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.connect(gain)
      gain.connect(this.sfxGain)
      osc.type = 'triangle'
      osc.frequency.value = note
      gain.gain.setValueAtTime(0.8, this.ctx.currentTime + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.25)
      osc.start(this.ctx.currentTime + i * 0.1)
      osc.stop(this.ctx.currentTime + i * 0.1 + 0.25)
    })
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.isMuted ? 0 : 0.5
    }
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.isMuted ? 0 : 1.0
    }
    return this.isMuted
  }
}