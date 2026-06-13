import * as THREE from 'three'

export default class Scene {
  constructor() {
    this.scene = new THREE.Scene()
    this.camera = null
    this.renderer = null
  }

  init() {
    // caméra
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.set(0, 4, 8)
    this.camera.lookAt(0, 0, 0)

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.body.appendChild(this.renderer.domElement)

    // lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(5, 10, 5)
    dirLight.castShadow = true
    this.scene.add(dirLight)

    // brouillard
    this.scene.fog = new THREE.Fog(0x1a1a2e, 20, 80)

    // background
    this.scene.background = new THREE.Color(0x1a1a2e)

    // resize
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