import * as THREE from 'three'

const LANE_WIDTH = 3
const ROAD_WIDTH = LANE_WIDTH * 3
const SEGMENT_LENGTH = 40
const NUM_SEGMENTS = 4

export default class Road {
  constructor(scene) {
    this.scene = scene
    this.segments = []
  }

  init() {
    this.roadMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 })
    this.lineMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
    this.sidewalkMaterial = new THREE.MeshLambertMaterial({ color: 0x555566 })
    this.curbMaterial = new THREE.MeshLambertMaterial({ color: 0x888899 })
    this.groundMaterial = new THREE.MeshLambertMaterial({ color: 0x2a2a3a  })

    for (let i = 0; i < NUM_SEGMENTS; i++) {
      this.createSegment(i * SEGMENT_LENGTH)
    }
  }

  createSegment(zOffset) {
    const group = new THREE.Group()

    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(60, 0.05, SEGMENT_LENGTH),
      this.groundMaterial
    )
    ground.position.y = -0.05
    ground.receiveShadow = true
    group.add(ground)

    const road = new THREE.Mesh(
      new THREE.BoxGeometry(ROAD_WIDTH, 0.1, SEGMENT_LENGTH),
      this.roadMaterial
    )
    road.receiveShadow = true
    group.add(road)

    const edgeGeo = new THREE.BoxGeometry(0.15, 0.12, SEGMENT_LENGTH)
    const leftEdge = new THREE.Mesh(edgeGeo, this.lineMaterial)
    leftEdge.position.x = -(ROAD_WIDTH / 2)
    group.add(leftEdge)

    const rightEdge = new THREE.Mesh(edgeGeo, this.lineMaterial)
    rightEdge.position.x = ROAD_WIDTH / 2
    group.add(rightEdge)

    const dashCount = 8
    const dashLength = SEGMENT_LENGTH / dashCount / 2

    for (const xPos of [-LANE_WIDTH / 2, LANE_WIDTH / 2]) {
      for (let d = 0; d < dashCount; d++) {
        const dash = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.12, dashLength * 0.8),
          this.lineMaterial
        )
        dash.position.x = xPos
        dash.position.z = -SEGMENT_LENGTH / 2 + d * (SEGMENT_LENGTH / dashCount) + dashLength / 2
        group.add(dash)
      }
    }

    const sidewalkGeo = new THREE.BoxGeometry(3, 0.25, SEGMENT_LENGTH)
    const leftSidewalk = new THREE.Mesh(sidewalkGeo, this.sidewalkMaterial)
    leftSidewalk.position.x = -(ROAD_WIDTH / 2 + 1.5)
    leftSidewalk.position.y = 0.1
    leftSidewalk.receiveShadow = true
    group.add(leftSidewalk)

    const rightSidewalk = new THREE.Mesh(sidewalkGeo, this.sidewalkMaterial)
    rightSidewalk.position.x = ROAD_WIDTH / 2 + 1.5
    rightSidewalk.position.y = 0.1
    rightSidewalk.receiveShadow = true
    group.add(rightSidewalk)

    const curbGeo = new THREE.BoxGeometry(0.2, 0.3, SEGMENT_LENGTH)
    const leftCurb = new THREE.Mesh(curbGeo, this.curbMaterial)
    leftCurb.position.x = -(ROAD_WIDTH / 2)
    leftCurb.position.y = 0.1
    group.add(leftCurb)

    const rightCurb = new THREE.Mesh(curbGeo, this.curbMaterial)
    rightCurb.position.x = ROAD_WIDTH / 2
    rightCurb.position.y = 0.1
    group.add(rightCurb)

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