import * as THREE from 'three'

const LANE_WIDTH = 3
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]

const POWERUP_TYPES = [
  { name: 'shield', color: 0x4d96ff, emissive: 0x2244ff },
  { name: 'life', color: 0xff4d6d, emissive: 0xff0044 },
  { name: 'slow', color: 0x6bcb77, emissive: 0x00aa44 },
]

export default class Powerups {
  constructor(scene) {
    this.scene = scene
    this.powerups = []
    this.frameCount = 0
    this.spawnInterval = 200
  }

  init() {}

  createShieldMesh() {
    const group = new THREE.Group()
    const mat = new THREE.MeshLambertMaterial({ color: 0x4d96ff, emissive: 0x2244ff, emissiveIntensity: 0.5 })
    const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8 })

    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), mat)
    group.add(cube)

    const square = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.85), whiteMat)
    group.add(square)

    return group
  }

  createLifeMesh() {
    const group = new THREE.Group()
    const mat = new THREE.MeshLambertMaterial({ color: 0xff4d6d, emissive: 0xff0044, emissiveIntensity: 0.6 })
    const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.9 })

    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), mat)
    group.add(cube)

    const v = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.85), whiteMat)
    group.add(v)
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.85), whiteMat)
    group.add(h)

    return group
  }

  createSlowMesh() {
    const group = new THREE.Group()
    const mat = new THREE.MeshLambertMaterial({ color: 0x6bcb77, emissive: 0x00aa44, emissiveIntensity: 0.5 })
    const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8 })

    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), mat)
    group.add(cube)

    for (let i = -1; i <= 1; i++) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.85), whiteMat)
      line.position.y = i * 0.22
      group.add(line)
    }

    return group
  }

  spawn() {
    const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)]
    const lane = Math.floor(Math.random() * 3)

    let mesh
    if (type.name === 'shield') mesh = this.createShieldMesh()
    else if (type.name === 'life') mesh = this.createLifeMesh()
    else mesh = this.createSlowMesh()

    const haloGeo = new THREE.TorusGeometry(0.65, 0.05, 8, 24)
    const haloMat = new THREE.MeshLambertMaterial({
      color: type.color,
      emissive: type.emissive,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.7
    })
    const halo = new THREE.Mesh(haloGeo, haloMat)
    mesh.add(halo)

    mesh.position.set(LANES[lane], 1.2, -50)
    mesh.userData = { type: type.name, lane }

    this.scene.add(mesh)
    this.powerups.push(mesh)
  }

  update(speed) {
    this.frameCount++

    if (this.frameCount % this.spawnInterval === 0) {
      this.spawn()
    }

    this.powerups.forEach(p => {
      p.position.z += speed
      p.rotation.y += 0.05
      p.position.y = 1.2 + Math.sin(Date.now() * 0.003 + p.position.x) * 0.2
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