export default class ScoreManager {
  constructor() {
    this.score = 0
    this.level = 1
    this.frameCount = 0
    this.startLevel = 1
    this.multiplier = 1
  }

  setStartLevel(level) {
    this.startLevel = level
    this.level = level
  }

  update() {
    this.frameCount++
    if (this.frameCount % 10 === 0) {
      this.score += this.multiplier
    }
    if (this.score > 0 && this.score % 200 === 0) {
      this.level = Math.min(3, Math.floor(this.score / 200) + this.startLevel)
    }
  }

  getSpeed() {
    const speeds = { 1: 0.3, 2: 0.5, 3: 0.8 }
    return speeds[this.level] || 0.8
  }

  reset() {
    this.score = 0
    this.level = this.startLevel
    this.frameCount = 0
    this.multiplier = 1
  }
}