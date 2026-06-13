import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const LANE_WIDTH = 3
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]

export default class Player {
  constructor(scene) {
    this.scene = scene
    this.currentLane = 1
    this.targetX = 0
    this.mesh = null
    this.wheels = []
    this.shieldMesh = null
    this.isMoving = false
    this.lives = 3
    this.isInvincible = false
    this.loaded = false
  }

  init() {
    const group = new THREE.Group()
    group.position.set(0, 0.3, 4)
    this.mesh = group
    this.scene.add(group)

    // bouclier
    const shieldGeo = new THREE.SphereGeometry(1.8, 16, 16)
    const shieldMat = new THREE.MeshLambertMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.25,
      emissive: 0x0044ff,
      emissiveIntensity: 0.3
    })
    this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat)
    this.shieldMesh.position.y = 0.7
    this.shieldMesh.visible = false
    group.add(this.shieldMesh)

    // le modèle GLB
    const loader = new GLTFLoader()
    loader.load('/models/kart-oopi.glb', (gltf) => {
      const model = gltf.scene
      model.scale.set(1.5, 1.5, 1.5)
      model.rotation.y = Math.PI
      model.position.y = 0
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
      group.add(model)
      this.loaded = true
    })

    window.addEventListener('keydown', (e) => this.onKeyDown(e))
  }

  onKeyDown(e) {
    if (e.key === 'ArrowLeft' && this.currentLane > 0) {
      this.currentLane--
      this.targetX = LANES[this.currentLane]
    }
    if (e.key === 'ArrowRight' && this.currentLane < 2) {
      this.currentLane++
      this.targetX = LANES[this.currentLane]
    }
  }

  showShield(active) {
    if (this.shieldMesh) this.shieldMesh.visible = active
  }

  update() {
    this.mesh.position.x += (this.targetX - this.mesh.position.x) * 0.15
    this.mesh.rotation.z = (this.targetX - this.mesh.position.x) * -0.1

    if (this.shieldMesh && this.shieldMesh.visible) {
      this.shieldMesh.rotation.y += 0.03
    }
  }

  getPosition() {
    return this.mesh.position
  }
}