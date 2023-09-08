import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { resizeRendererToDisplay } from './util'

export class ThreeCore {
  constructor(canvas, option = {}) {
    console.log('ThreeCore', { ...option })
    const { scene = {}, camera = {} } = option
    this.canvas = canvas
    this.initRenderer()
    this.initScene(scene)
    this.initCamera(camera)
    // 轨道控制器
    this.initControl()
    this.initLight()
    requestAnimationFrame(() => this.render())
    this.init()
  }
  init() {
    // 需要继承
  }
  initRenderer() {
    const renderer = new THREE.WebGLRenderer(this.canvas)
    renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer = renderer
  }
  initScene(option) {
    const { background = 0x001111 } = option
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(background)
    this.scene = scene
  }
  initCamera(option) {
    const {
      fov = 75,
      aspect = window.innerWidth / window.innerHeight,
      near = 0.1,
      far = 2000,
      position = { x: 0, y: 800, z: 400 },
      axesHelperSize = 0
    } = option
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    const { x, y, z } = position
    camera.position.set(x, y, z)
    this.scene.add(camera)
    // 坐标轴辅助
    if (axesHelperSize) {
      const AxesHelper = new THREE.AxesHelper(axesHelperSize)
      this.scene.add(AxesHelper)
    }
    this.camera = camera
  }
  initControl() {
    const controls = new OrbitControls(this.camera, this.canvas)
    controls.update()
  }
  initLight() {
    // 点光源
    const point = new THREE.PointLight(0xffffff)
    point.position.set(100, 100, 100)
    this.scene.add(point)
    // 环境光
    const light = new THREE.AmbientLight(0xcccccc)
    light.position.set(0, 0, 0)
    this.scene.add(light)
  }
  render(time) {
    time *= 0.001
    if (resizeRendererToDisplay(this.renderer)) {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
      this.camera.updateMatrix()
    }
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(() => this.render())
  }
}