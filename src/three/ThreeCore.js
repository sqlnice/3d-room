import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { resizeRendererToDisplay } from './util'
import TWEEN from '@tweenjs/tween.js'

export default class ThreeCore {
  constructor(canvas, options = {}) {
    if (!canvas) return console.error('canvas is required')
    this.options = options
    const { camera = {} } = options
    this.canvas = canvas
    this.initRenderer()
    this.initScene()
    this.initCamera(camera)
    // 轨道控制器
    this.initControl()
    this.initLight()
    this.render()
    window.onresize = () => {
      this.onWindowResize()
    }
    this.init()
  }
  initRenderer() {
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer = renderer
  }
  initScene() {
    const scene = new THREE.Scene()
    this.scene = scene
  }
  initCamera(option) {
    const {
      fov = 75,
      aspect = this.canvas.clientWidth / this.canvas.clientHeight,
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
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
  render(time) {
    time *= 0.001
    if (resizeRendererToDisplay(this.renderer)) {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
      this.camera.updateProjectionMatrix()
    }
    const { needTween = true } = this.options
    needTween && TWEEN.update()
    this.renderer.render(this.scene, this.camera)
    this.rafId = requestAnimationFrame(() => this.render())
  }
  dispose(obj) {
    while (obj.children.length > 0) {
      this.dispose(obj.children[0])
      obj.remove(obj.children[0])
    }
    obj.geometry?.dispose?.()
    console.log(obj.material)
    if (obj.material) {
      Object.keys(obj.material).forEach(prop => {
        if (!obj.material[prop]) return
        if (obj.material[prop]?.map !== null && typeof obj.material[prop].map?.dispose === 'function')
          obj.material[prop].map.dispose()
        if (obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function') {
          obj.material[prop].dispose()
        }
      })
      obj.material.map?.dispose?.()
      obj.material.dispose?.()
    }
  }
  clearScene() {
    const children = this.scene.children
    children.map(child => {
      this.dispose(this.scene, child)
    })
    this.scene.remove()
    this.scene = null
  }
  destroy() {
    cancelAnimationFrame(this.rafId)
    this.rafId = null
    window.onresize = null
    this.clear()
    this.canvas.ondblclick = null
    this.canvas.onmousemove = null
    this.renderer.dispose()
    this.renderer.forceContextLoss()
    this.renderer.content = null
    this.renderer.domElement = null
    this.clearScene()
    this.camera = null
    this.controls = null
    console.log('three.js is destroyed', this.renderer.info)
  }
  getOperateObject(event) {
    event.preventDefault()
    const { offsetWidth, offsetHeight } = this.canvas
    const { left, top } = this.canvas.getBoundingClientRect()
    const scale = 1
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    mouse.x = ((event.clientX - left) / scale / offsetWidth) * 2 - 1
    mouse.y = -((event.clientY - top) / scale / offsetHeight) * 2 + 1
    raycaster.setFromCamera(mouse, this.camera)
    const intersects = raycaster.intersectObjects(this.scene.children, true)
    if (intersects.length) return intersects[0].object
    return null
  }
}
