import * as THREE from 'three'
import ThreeCore from './ThreeCore'
import defaultFloorImage from '@/assets/floor.jpg'
import Wall from '@/components/Wall.js'
import Air from '@/components/Air.js'
import SimpleRack from '@/components/SimpleRack.js'
import ShowRackCapacity from '@/components/ShowRackCapacity.js'
export default class ThreeRoom extends ThreeCore {
  init() {
    if (!this.canvas) return
    this.createFloor()
    if (this.options.needBindEvent) {
      this.bindEvent()
      const { hover, closeHover } = this.options
      this.hover = hover
      this.closeHover = closeHover
    }
  }
  bindEvent() {
    this.canvas.ondblclick = event => {
      const obj = this.getOperateObject(event)
      if (!obj) return
      if (typeof obj.dblclick === 'function') {
        obj.dblclick(obj)
      }
    }
    this.canvas.onmousemove = event => {
      const obj = this.getOperateObject(event)
      if (!obj) return
      if (typeof obj.hover === 'function') {
        obj.hover(obj)
        this.hover(event, obj.userData)
      } else if (obj.parent && typeof obj.parent.hover === 'function') {
        obj.parent.hover(obj)
        this.hover(event, obj.userData)
      } else {
        typeof obj.closeHover === 'function' && obj.closeHover(obj)
        this.closeHover(obj)
      }
    }
  }
  createFloor() {
    const floorImage = this.options.floor.image || defaultFloorImage
    // 地面
    const texture = new THREE.TextureLoader().load(floorImage, () => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      const repeatX = 2.4
      const repeatY = repeatX * (texture.image.height / texture.image.width)
      texture.repeat.set(repeatX, repeatY)
      const planeGeometry = new THREE.PlaneGeometry(1200, 1000)
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      })
      const plane = new THREE.Mesh(planeGeometry, planeMaterial)
      // 地面水平
      plane.rotation.x = Math.PI / 2
      this.scene.add(plane)
    })
  }
  createRoom(configs) {
    const { walls = [], airs = [] } = configs
    new Air(this.scene, airs)
    new Wall(this.scene, walls)
  }
  createRack(configs) {
    const { racks = [] } = configs
    for (let i = 0; i < racks.length; i++) {
      new SimpleRack(this.scene, racks[i])
    }
  }
  // 控制显隐
  controlRack(show = true) {
    this.scene.children.map(item => {
      if (item.name === 'SimpleRack') item.visible = show
    })
  }
  // 机柜使用率
  showRackUsage(racks) {}
  // 机柜容量
  showRackCapacity(racks) {
    this.controlRack(false)
    for (let i = 0; i < racks.length; i++) {
      new ShowRackCapacity(this.scene, racks[i])
    }
  }
}
