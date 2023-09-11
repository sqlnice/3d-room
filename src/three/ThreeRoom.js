import * as THREE from 'three'
import ThreeCore from './ThreeCore'
import defaultFloorImage from '@/assets/floor.jpg'
import Wall from '@/components/Wall.js'
import Air from '@/components/Air.js'
export default class ThreeRoom extends ThreeCore {
  init() {
    this.createFloor()
    if (this.options.needBindEvent) {
      this.bindEvent()
    }
  }
  bindEvent() {
    this.canvas.ondblclick = event => {
      const obj = this.getOperateObject(event)
      if (!obj) return
      if (typeof obj.dblclick === 'function') {
        console.log(obj.dblclick)
        obj.dblclick(obj)
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
}
