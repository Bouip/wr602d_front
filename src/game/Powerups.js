import * as THREE from 'three'

const LANE_WIDTH = 3
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]

const POWERUP_TYPES = [
  { name: 'shield', color: 0x00aaff, emissive: 0x0044ff, symbol: '🛡️' },
  { name: 'life', color: 0xff0044, emissive: 0xff0000, symbol: '❤️' },
  { name: 'boost', color: 0xffff00, emissive: 0xffaa00, symbol: '⚡' },
  { name: 'slow', color: 0x00ff88, emissive: 0x00aa44, symbol: '🐌' },
]

export default class Powerups {
  constructor(scene) {
    this.scene = scene
    this.powerups = []
    this.frameCount = 0
    this.spawnInterval = 200
  }

  init() {}

  spawn() {
    const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)]
    const lane = Math.floor(Math.random() * 3)

    const group = new THREE.Group()

    // sphère
    const geo = new THREE.SphereGeometry(0.5, 16, 16)
    const mat = new THREE.MeshLambertMaterial({
      color: type.color,
      emissive: type.emissive,
      emissiveIntensity: 0.5
    })
    const sphere = new THREE.Mesh(geo, mat)
    group.add(sphere)

    // anneau autour
    const ringGeo = new THREE.TorusGeometry(0.7, 0.08, 8, 24)
    const ringMat = new THREE.MeshLambertMaterial({ color: type.color })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    group.add(ring)

    group.position.set(LANES[lane], 1, -50)
    group.userData = { type: type.name, lane }

    this.scene.add(group)
    this.powerups.push(group)
  }

  update(speed) {
    this.frameCount++

    if (this.frameCount % this.spawnInterval === 0) {
      this.spawn()
    }

    this.powerups.forEach(p => {
      p.position.z += speed
      // effet rotation
      p.rotation.y += 0.05
      p.children[1].rotation.z += 0.03
    })

    this.powerups = this.powerups.filter(p => {
      if (p.position.z > 10) {
        this.scene.remove(p)
        return false
      }
      return true
    })
  }

  getPowerups() {
    return this.powerups
  }

  remove(powerup) {
    this.scene.remove(powerup)
    this.powerups = this.powerups.filter(p => p !== powerup)
  }
}