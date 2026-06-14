import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const BUILDING_FILES = [
  'building-a.glb',
  'building-b.glb',
  'building-c.glb',
  'building-skyscraper-a.glb',
  'building-skyscraper-b.glb',
  'low-detail-building-a.glb',
  'low-detail-building-b.glb',
]

const TINTS = [0xff6b6b, 0xffd93d, 0x6bcb77, 0x4d96ff, 0xff6fc8, 0xff9a3c]

const SPACING = 8
const NUM_BUILDINGS = 20
const LEFT_X = -10
const RIGHT_X = 10

export default class Buildings {
  constructor(scene) {
    this.scene = scene
    this.buildings = []
    this.models = []
    this.modelsLoaded = false
    this.loader = new GLTFLoader()
  }

  init() {
    let loaded = 0
    BUILDING_FILES.forEach(file => {
      this.loader.load(`/models/buildings/${file}`, (gltf) => {
        const model = gltf.scene
        this.models.push(model)
        loaded++
        if (loaded === BUILDING_FILES.length) {
          this.modelsLoaded = true
          this.spawnAll()
        }
      })
    })
  }

  spawnAll() {
    for (let i = 0; i < NUM_BUILDINGS; i++) {
      const z = -i * SPACING
      this.spawnBuilding(LEFT_X, z, -Math.PI / 2)
      this.spawnBuilding(RIGHT_X, z, Math.PI / 2)
    }
  }

  spawnBuilding(x, z, rotY) {
    if (this.models.length === 0) return

    const model = this.models[Math.floor(Math.random() * this.models.length)]
    const clone = model.clone()
    const tint = TINTS[Math.floor(Math.random() * TINTS.length)]

    const scale = 4 + Math.random() * 3
    clone.scale.set(scale, scale, scale)
    clone.position.set(x, 0, z)
    clone.rotation.y = rotY

    clone.traverse(child => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone()
        child.material.color.setHex(tint)
        child.castShadow = false
        child.receiveShadow = false
      }
    })

    this.scene.add(clone)
    this.buildings.push({ mesh: clone, side: x })
  }

  update(speed) {
    if (!this.modelsLoaded) return

    this.buildings.forEach(b => {
      b.mesh.position.z += speed
      if (b.mesh.position.z > 20) {
        b.mesh.position.z -= NUM_BUILDINGS * SPACING
        const tint = TINTS[Math.floor(Math.random() * TINTS.length)]
        b.mesh.traverse(child => {
          if (child.isMesh && child.material) {
            child.material.color.setHex(tint)
          }
        })
      }
    })
  }
}