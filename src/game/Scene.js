import * as THREE from 'three'

export default class Scene {
  constructor() {
    this.scene = new THREE.Scene()
    this.camera = null
    this.renderer = null
  }

  init() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.set(0, 4, 8)
    this.camera.lookAt(0, 0, 0)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    document.body.appendChild(this.renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffd4a3, 1.0)
    this.scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
    dirLight.position.set(5, 20, 5)
    dirLight.castShadow = true
    this.scene.add(dirLight)

    const skyLight = new THREE.HemisphereLight(0xff6eb4, 0xff8c42, 1.2)
    this.scene.add(skyLight)

    this.scene.fog = new THREE.Fog(0xff7eb3, 40, 120)
    this.scene.background = new THREE.Color(0xff7eb3)

    const groundGeo = new THREE.PlaneGeometry(200, 400)
    const groundMat = new THREE.MeshLambertMaterial({ color: 0xd4956a })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.05
    ground.receiveShadow = true
    this.scene.add(ground)

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    })
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }
}