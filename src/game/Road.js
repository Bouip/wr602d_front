import * as THREE from 'three'

const LANE_WIDTH = 3
const ROAD_WIDTH = LANE_WIDTH * 3
const SEGMENT_LENGTH = 40
const NUM_SEGMENTS = 4

export default class Road {
  constructor(scene) {
    this.scene = scene
    this.segments = []
    this.speed = 0.3
  }

  init() {
    // matériaux
    this.roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 })
    this.lineMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
    this.sidewalkMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 })

    for (let i = 0; i < NUM_SEGMENTS; i++) {
      this.createSegment(i * SEGMENT_LENGTH)
    }
  }

  createSegment(zOffset) {
    const group = new THREE.Group()

    // route
    const road = new THREE.Mesh(
      new THREE.BoxGeometry(ROAD_WIDTH, 0.1, SEGMENT_LENGTH),
      this.roadMaterial
    )
    road.receiveShadow = true
    group.add(road)

    // lignes de voie
    for (let i = -1; i <= 1; i++) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.11, SEGMENT_LENGTH * 0.8),
        this.lineMaterial
      )
      line.position.x = i * LANE_WIDTH
      group.add(line)
    }

    // trottoirs
    const sidewalkGeo = new THREE.BoxGeometry(2, 0.3, SEGMENT_LENGTH)
    const leftSidewalk = new THREE.Mesh(sidewalkGeo, this.sidewalkMaterial)
    leftSidewalk.position.x = -(ROAD_WIDTH / 2 + 1)
    leftSidewalk.position.y = 0.1
    group.add(leftSidewalk)

    const rightSidewalk = new THREE.Mesh(sidewalkGeo, this.sidewalkMaterial)
    rightSidewalk.position.x = ROAD_WIDTH / 2 + 1
    rightSidewalk.position.y = 0.1
    group.add(rightSidewalk)

    group.position.z = -zOffset
    this.scene.add(group)
    this.segments.push(group)
  }

  update(speed = 0.3) {
    this.segments.forEach(segment => {
        segment.position.z += speed
        if (segment.position.z > SEGMENT_LENGTH) {
        segment.position.z -= NUM_SEGMENTS * SEGMENT_LENGTH
        }
    })
    }
}