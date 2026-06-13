import * as THREE from 'three'

const COLORS = [0xff6b6b, 0x6bcbff, 0xffeb6b, 0x6bff9e, 0xff6bff, 0xff9e6b]

export default class Buildings {
  constructor(scene) {
    this.scene = scene
    this.buildings = []
    this.segmentLength = 40
    this.numSegments = 6
  }

  init() {
    for (let i = 0; i < this.numSegments; i++) {
      this.createSegment(i * this.segmentLength)
    }
  }

  createBuilding(x, z) {
    const width = 2 + Math.random() * 3
    const height = 4 + Math.random() * 12
    const depth = 2 + Math.random() * 3
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]

    const group = new THREE.Group()

    // bâtiment
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshLambertMaterial({ color })
    )
    body.position.y = height / 2
    body.castShadow = true
    group.add(body)

    // fenêtres
    const winMat = new THREE.MeshLambertMaterial({ color: 0xffffaa, emissive: 0x444400 })
    const rows = Math.floor(height / 2)
    const cols = Math.floor(width / 1.2)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.3) {
          const win = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.1), winMat)
          win.position.set(
            -width / 2 + 0.8 + c * 1.2,
            1 + r * 2,
            depth / 2 + 0.05
          )
          group.add(win)
        }
      }
    }

    group.position.set(x, 0, -z)
    this.scene.add(group)
    this.buildings.push(group)
  }

  createSegment(zOffset) {
    // bâtiments à gauche
    this.createBuilding(-8 - Math.random() * 2, zOffset + Math.random() * this.segmentLength)
    this.createBuilding(-12 - Math.random() * 2, zOffset + Math.random() * this.segmentLength)
    // bâtiments à droite
    this.createBuilding(8 + Math.random() * 2, zOffset + Math.random() * this.segmentLength)
    this.createBuilding(12 + Math.random() * 2, zOffset + Math.random() * this.segmentLength)
  }

  update(speed) {
    this.buildings.forEach(building => {
      building.position.z += speed

      if (building.position.z > 20) {
        const x = (Math.random() > 0.5 ? 1 : -1) * (8 + Math.random() * 4)
        building.position.z = -this.segmentLength * this.numSegments
        building.position.x = x
      }
    })
  }
}