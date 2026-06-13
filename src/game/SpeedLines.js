import * as THREE from 'three'

export default class SpeedLines {
  constructor(scene) {
    this.scene = scene
    this.lines = []
    this.group = new THREE.Group()
    scene.add(this.group)
  }

  init() {
    for (let i = 0; i < 20; i++) {
      this.createLine()
    }
  }

  createLine() {
    const length = 2 + Math.random() * 4
    const geo = new THREE.BufferGeometry()
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, length)
    ]
    geo.setFromPoints(points)

    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: Math.random() * 0.3 + 0.1
    })

    const line = new THREE.Line(geo, mat)
    line.position.set(
      (Math.random() > 0.5 ? 1 : -1) * (7 + Math.random() * 5),
      Math.random() * 3,
      -Math.random() * 40
    )

    this.group.add(line)
    this.lines.push(line)
  }

  update(speed) {
    this.lines.forEach(line => {
      line.position.z += speed * 2

      if (line.position.z > 10) {
        line.position.z = -40
        line.position.x = (Math.random() > 0.5 ? 1 : -1) * (7 + Math.random() * 5)
        line.position.y = Math.random() * 3
      }

      line.material.opacity = Math.min(0.5, speed * 0.8)
    })
  }
}