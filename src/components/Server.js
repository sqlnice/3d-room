import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import rack_inside from '@/assets/rack_inside.jpg'
export default class Server {
  constructor(scene, item) {
    this.scene = scene
    this.init(item)
  }
  init(item) {
    const {
      h,
      py,
      rackConfig: { w: rackW, h: rackH, depth: rackDepth }
    } = item
    const rackGroup = new THREE.Group()
    rackGroup.position.set(0, py - rackH / 2, 0)
    rackGroup.name = 'ServerGroup'
    rackGroup.userData = item

    const color = 0x9ac0cd
    const materialBase = new THREE.MeshBasicMaterial({
      color,
      map: new THREE.TextureLoader().load(rack_inside)
    })
    // 向下取整
    const serverType = Math.floor(h / 10)
    const serverImage = getImageUrl(serverType)
    const serverGeometry = new THREE.BoxGeometry(rackW - 4, h / 2, rackDepth - 2)
    const serverMaterials = [
      materialBase,
      materialBase,
      materialBase,
      materialBase,
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(serverImage)
      }),
      materialBase
    ]
    const serverMesh = new THREE.Mesh(serverGeometry, serverMaterials)
    serverMesh.name = 'server'
    rackGroup.add(serverMesh)
    this.scene.add(rackGroup)
  }
}

function getImageUrl(type) {
  return new URL(`../assets/server${type}.jpg`, import.meta.url).href
}
