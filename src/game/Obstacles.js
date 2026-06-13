import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const LANE_WIDTH = 3
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]

const OBSTACLE_CONFIGS = [
  { file: 'truck.glb', scale: 1.2, yOffset: 0, points: 0 },
  { file: 'garbage-truck.glb', scale: 1.2, yOffset: 0, points: 0 },
  { file: 'sedan.glb', scale: 1.2, yOffset: 0, points: 0 },
  { file: 'police.glb', scale: 1.2, yOffset: 0, points: 0 },
  { file: 'cone.glb', scale: 1.5, yOffset: 0, points: 0 },
  { file: 'box.glb', scale: 1.2, yOffset: 0, points: 0 },
]

export default class Obstacles {
  constructor(scene) {
    this.scene = scene
    this.obstacles = []
    this.spawnInterval = 80
    this.frameCount = 0
    this.speed = 0.3
    this.loader = new GLTFLoader()
    this.models = {}
    this.modelsLoaded = false
    this.loadingCount = 0
  }

  init() {
    // précharge tous les modèles
    OBSTACLE_CONFIGS.forEach(config => {
      this.loader.load(`/models/${config.file}`, (gltf) => {
        this.models[config.file] = { scene: gltf.scene, config }
        this.loadingCount++
        if (this.loadingCount === OBSTACLE_CONFIGS.length) {
          this.modelsLoaded = true
        }
      })
    })
  }

  spawnObstacle() {
    if (!this.modelsLoaded) return

    const keys = Object.keys(this.models)
    const key = keys[Math.floor(Math.random() * keys.length)]
    const { scene: modelScene, config } = this.models[key]
    const lane = Math.floor(Math.random() * 3)

    const group = new THREE.Group()
    const clone = modelScene.clone()
    clone.scale.set(config.scale, config.scale, config.scale)
    clone.position.y = config.yOffset
    clone.rotation.y = Math.PI

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
      }
    })

    group.add(clone)
    group.position.set(LANES[lane], 0.3, -50)
    group.userData = { type: key, lane }

    this.scene.add(group)
    this.obstacles.push(group)
  }

  update(speed) {
    this.frameCount++
    this.speed = speed

    if (this.frameCount % this.spawnInterval === 0) {
      this.spawnObstacle()
    }

    this.obstacles.forEach(obstacle => {
      obstacle.position.z += this.speed
    })

    this.obstacles = this.obstacles.filter(obstacle => {
      if (obstacle.position.z > 10) {
        this.scene.remove(obstacle)
        return false
      }
      return true
    })
  }

  getObstacles() {
    return this.obstacles
  }
}