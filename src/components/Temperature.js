import * as THREE from 'three'
import h337 from '@mars3d/heatmap.js'
export default class Temperature {
  constructor(scene, options) {
    this.timer = null
    this.options = options || {
      width: 800,
      height: 600
    }
    this.scene = scene
    this.init()
  }
  init() {
    const texture = new THREE.CanvasTexture(this.createTemperatureImage())
    const geometry = new THREE.BoxGeometry(this.options.width, this.options.height)
    const material = new THREE.MeshBasicMaterial({
      map: texture
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.y = 2
    mesh.rotation.x = Math.PI / 2
    this.board = mesh
    this.scene.add(mesh)
    this.timer = setInterval(() => {
      material.map.dispose()
      material.map = new THREE.CanvasTexture(this.createTemperatureImage())
    }, 1000)
  }
  createTemperatureImage() {
    const { width, height } = this.options
    const root = document.getElementById('app')
    const ele = document.createElement('div')
    ele.style.cssText = `width:${width}px;height:${height}px`
    root.appendChild(ele)
    const instance = h337.create({
      container: ele,
      radius: width / 2, // [0,+∞)
      maxOpacity: 1,
      minOpacity: 0,
      opacity: 0.8
    })
    const data = []
    for (let i = 0; i < 15; i++) {
      const x = Math.floor(Math.random() * width)
      const y = Math.floor(Math.random() * height)
      const value = Math.floor(Math.random() * 100)
      data.push({ x, y, value })
    }
    instance.setData({
      min: 0,
      max: 100,
      data
    })
    root.removeChild(ele)
    return instance._renderer.canvas
  }
}
