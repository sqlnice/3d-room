import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { canvas2Texture } from '../three/util'
import rack_skin from '@/assets/rack_skin.jpg'
import rack_left from '@/assets/rack_left.jpg'
import rack_right from '@/assets/rack_right.jpg'
import rack_door_back from '@/assets/rack_door_back.jpg'
import rack_door_front from '@/assets/rack_door_front.jpg'
export default class CreateRack {
  constructor(scene, item) {
    this.scene = scene
    this.init(item)
  }
  init(item) {
    const COLOR = 0x8e8e8e
    const BOARD_DEPTH = 2
    const { w, h, depth } = item
    const rackGroup = new THREE.Group()
    rackGroup.position.set(0, -h / 2, 0)
    rackGroup.rotation.y = 0
    rackGroup.name = 'RackGroup'
    rackGroup.userData = item

    // 机柜外壳基础材质
    const textureSkin = new THREE.TextureLoader().load(rack_skin)
    const materialSkin = new THREE.MeshBasicMaterial({ color: COLOR, map: textureSkin })
    // 机柜上
    const geometryTop = new THREE.BoxGeometry(w, BOARD_DEPTH, depth)
    const materialTop = []
    materialTop.push(
      materialSkin,
      materialSkin,
      new THREE.MeshBasicMaterial({
        color: COLOR,
        map: canvas2Texture(item.name, { width: w, height: depth })
      }),
      materialSkin,
      materialSkin,
      materialSkin
    )
    const meshTop = new THREE.Mesh(geometryTop, materialTop)
    meshTop.position.set(0, h - 1, 0)
    // 机柜下
    const geometryBottom = new THREE.BoxGeometry(w, BOARD_DEPTH, depth)
    const meshBottom = new THREE.Mesh(geometryBottom, materialSkin)
    meshBottom.position.set(0, 0, 0)
    // 机柜左
    const geometryLeft = new THREE.BoxGeometry(BOARD_DEPTH, h, depth)
    const materialLeft = []
    materialLeft.push(
      materialSkin,
      materialSkin,
      materialSkin,
      materialSkin,
      new THREE.MeshBasicMaterial({
        color: COLOR,
        map: new THREE.TextureLoader().load(rack_left)
      }),
      materialSkin
    )
    const meshLeft = new THREE.Mesh(geometryLeft, materialLeft)
    meshLeft.position.set(-w / 2 + 1, h / 2, 0)
    // 机柜右
    const geometryRight = new THREE.BoxGeometry(BOARD_DEPTH, h, depth)
    const materialRight = []
    materialRight.push(
      materialSkin,
      materialSkin,
      materialSkin,
      materialSkin,
      new THREE.MeshBasicMaterial({
        color: COLOR,
        map: new THREE.TextureLoader().load(rack_right)
      }),
      materialSkin
    )
    const meshRight = new THREE.Mesh(geometryRight, materialRight)
    meshRight.position.set(w / 2 - 1, h / 2, 0)
    // 机柜后
    const geometryBack = new THREE.BoxGeometry(w, h, BOARD_DEPTH)
    const meshBack = new THREE.Mesh(geometryBack, materialSkin)
    meshBack.position.set(0, h / 2, -depth / 2)
    // 机柜前门
    const doorGroup = new THREE.Group()
    doorGroup.position.set(w / 2, h / 2, depth / 2)
    const geometryDoor = new THREE.BoxGeometry(w, h, BOARD_DEPTH)
    const materialDoor = []
    materialDoor.push(
      materialSkin,
      materialSkin,
      materialSkin,
      materialSkin,
      new THREE.MeshBasicMaterial({
        color: COLOR,
        map: new THREE.TextureLoader().load(rack_door_front)
      }),
      new THREE.MeshBasicMaterial({
        color: COLOR,
        map: new THREE.TextureLoader().load(rack_door_back)
      })
    )
    const meshDoor = new THREE.Mesh(geometryDoor, materialDoor)
    meshDoor.position.set(-w / 2, 0, 0)
    meshDoor.dblclick = this.operateDoor
    doorGroup.add(meshDoor)
    rackGroup.add(meshTop, meshBottom, meshLeft, meshRight, meshBack, doorGroup)
    this.scene.add(rackGroup)
  }

  operateDoor(door) {
    const item = door.parent
    if (item.rotation.y == 0) {
      new TWEEN.Tween(item.rotation)
        .to(
          {
            y: 0.7 * Math.PI
          },
          1500
        )
        .easing(TWEEN.Easing.Elastic.Out)
        .start()
    } else {
      new TWEEN.Tween(item.rotation)
        .to(
          {
            y: 0
          },
          300
        )
        .start()
    }
  }
}
