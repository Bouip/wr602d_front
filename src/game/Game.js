import Scene from './Scene.js'
import Road from './Road.js'
import Player from './Player.js'
import Obstacles from './Obstacles.js'
import Powerups from './Powerups.js'
import ScoreManager from './ScoreManager.js'
import Buildings from './Buildings.js'
import SoundManager from './SoundManager.js'
import HUD from '../ui/HUD.js'
import Menu from '../ui/Menu.js'
import SpeedLines from './SpeedLines.js'

export default class Game {
  constructor() {
    this.scene = new Scene()
    this.road = null
    this.player = null
    this.obstacles = null
    this.powerups = null
    this.buildings = null
    this.scoreManager = new ScoreManager()
    this.soundManager = new SoundManager()
    this.hud = new HUD(() => this.togglePause(), () => this.restart(), () => this.goToMenu(), () => this.toggleMute())
    this.menu = new Menu((level) => this.start(level))
    this.isGameOver = false
    this.isRunning = false
    this.isPaused = false
    this.lastLevel = 1
    this.currentUser = null
    this.shieldActive = false
    this.boostActive = false
    this.slowActive = false
    this.speedLines = null
    this.animationId = null

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.isRunning) {
        e.preventDefault()
        this.togglePause()
      }
    })
  }

  init() {
    this.scene.init()
    this.hud.init()
    window.gameInstance = this

    import('../ui/Auth.js').then(({ default: Auth }) => {
      const auth = new Auth((user) => {
        this.setUser(user)
        this.soundManager.init()
        this.soundManager.playMenuMusic()
        this.menu.showStart(user)
      })
      auth.show()
    })
  }

  start(level = 1) {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }

    if (this.road) this.road.segments.forEach(s => this.scene.scene.remove(s))
    if (this.player && this.player.mesh) this.scene.scene.remove(this.player.mesh)
    if (this.obstacles) this.obstacles.getObstacles().forEach(o => this.scene.scene.remove(o))
    if (this.buildings) this.buildings.buildings.forEach(b => this.scene.scene.remove(b.mesh || b))
    if (this.powerups) this.powerups.getPowerups().forEach(p => this.scene.scene.remove(p))
    if (this.speedLines) this.scene.scene.remove(this.speedLines.group)

    this.road = new Road(this.scene.scene)
    this.road.init()
    this.buildings = new Buildings(this.scene.scene)
    this.buildings.init()
    this.player = new Player(this.scene.scene)
    this.player.init()
    this.obstacles = new Obstacles(this.scene.scene)
    this.obstacles.init()
    this.powerups = new Powerups(this.scene.scene)
    this.powerups.init()
    this.speedLines = new SpeedLines(this.scene.scene)
    this.speedLines.init()

    this.scoreManager.setStartLevel(level)
    this.scoreManager.reset()
    this.lastLevel = level
    this.isGameOver = false
    this.isPaused = false
    this.isRunning = true
    this.shieldActive = false
    this.boostActive = false
    this.slowActive = false

    this.soundManager.init()
    this.soundManager.startBGM()

    this.animate()
  }

  restart() {
    this.hud.hidePause()
    this.isPaused = false
    this.isRunning = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.soundManager.stopBGM()
    this.start(this.scoreManager.startLevel)
  }

  goToMenu() {
    this.isRunning = false
    this.isPaused = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.hud.hidePause()
    this.soundManager.stopBGM()
    this.soundManager.playMenuMusic()
    this.menu.showStart(this.currentUser)
  }

  togglePause() {
    this.isPaused = !this.isPaused
    if (this.isPaused) {
      this.hud.showPause()
      this.soundManager.pauseBGM()
    } else {
      this.hud.hidePause()
      this.soundManager.resumeBGM()
      this.animate()
    }
  }

  toggleMute() {
    return this.soundManager.toggleMute()
  }

  activateShield() {
    this.shieldActive = true
    this.player.isInvincible = true
    this.player.showShield(true)
    this.hud.showPowerup('BOUCLIER', '#4d96ff')
    setTimeout(() => {
      this.shieldActive = false
      this.player.isInvincible = false
      this.player.showShield(false)
      this.hud.hidePowerup()
    }, 10000)
  }

  activateSlow() {
    this.slowActive = true
    this.hud.showPowerup('RALENTISSEMENT', '#6bcb77')
    setTimeout(() => {
      this.slowActive = false
      this.hud.hidePowerup()
    }, 5000)
  }

  checkPowerups() {
    const playerPos = this.player.getPosition()

    this.powerups.getPowerups().forEach(powerup => {
      const dx = Math.abs(playerPos.x - powerup.position.x)
      const dz = Math.abs(playerPos.z - powerup.position.z)

      if (dx < 1.2 && dz < 1.5) {
        const type = powerup.userData.type
        this.powerups.remove(powerup)
        this.soundManager.playPowerup()

        if (type === 'shield') this.activateShield()
        else if (type === 'life') {
          this.player.lives = Math.min(3, this.player.lives + 1)
          this.hud.showPowerup('+1 VIE', '#ff4d6d')
          setTimeout(() => this.hud.hidePowerup(), 2000)
        }
        else if (type === 'slow') this.activateSlow()

        this.hud.update(this.scoreManager.score, this.player.lives, this.scoreManager.level)
      }
    })
  }

  checkCollisions() {
    const playerPos = this.player.getPosition()

    this.obstacles.getObstacles().forEach(obstacle => {
      const dx = Math.abs(playerPos.x - obstacle.position.x)
      const dz = Math.abs(playerPos.z - obstacle.position.z)

      if (dx < 1.0 && dz < 1.5 && !this.player.isInvincible) {
        this.player.lives--
        this.player.isInvincible = true
        this.soundManager.playHit()

        setTimeout(() => {
          if (!this.shieldActive) {
            this.player.isInvincible = false
          }
        }, 2000)

        if (this.player.lives <= 0) {
          this.isRunning = false
          this.isGameOver = true
          if (this.animationId) {
            cancelAnimationFrame(this.animationId)
            this.animationId = null
          }
          this.soundManager.stopBGM()
          this.soundManager.playGameOverMusic()
          setTimeout(() => {
            this.menu.showGameOver(this.scoreManager.score, this.currentUser)
          }, 500)
        }

        this.hud.update(this.scoreManager.score, this.player.lives, this.scoreManager.level)
      }
    })

    if (this.scoreManager.level > this.lastLevel) {
      this.lastLevel = this.scoreManager.level
      this.soundManager.playLevelUp()
    }
  }

  animate() {
    if (!this.isRunning || this.isPaused) return

    this.animationId = requestAnimationFrame(() => this.animate())

    const speedMultiplier = this.slowActive ? 0.5 : 1
    const speed = this.scoreManager.getSpeed() * speedMultiplier

    this.scoreManager.update()
    this.road.update(speed)
    this.buildings.update(speed)
    this.player.update(speed)
    this.obstacles.update(speed)
    this.powerups.update(speed)
    this.checkCollisions()
    this.checkPowerups()
    this.speedLines.update(speed)

    if (this.player.isInvincible) {
      this.player.mesh.visible = Math.floor(Date.now() / 150) % 2 === 0
    } else {
      this.player.mesh.visible = true
    }

    this.hud.update(this.scoreManager.score, this.player.lives, this.scoreManager.level)
    this.scene.render()
  }

  setUser(user) {
    this.currentUser = user
    this.hud.setUser(user)
  }
}