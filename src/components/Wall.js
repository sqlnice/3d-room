import * as THREE from 'three'
import { CSG } from 'three-csg-ts'
import TWEEN from '@tweenjs/tween.js'
import doorIn from '@/assets/door_in.png'
import doorOut from '@/assets/door_out.png'
export default class CreateWall {
  constructor(scene, walls) {
    this.scene = scene
    this.init(walls)
  }
  init(walls) {
    for (let i = 0; i < walls.length; i++) {
      const wallConfig = walls[i]
      const { w, h, depth, pz, px, py, color, ry, window, doors } = wallConfig
      const wallGeometry = new THREE.BoxGeometry(w, h, depth)
      const wallMaterials = [
        new THREE.MeshBasicMaterial({
          color
        }),
        new THREE.MeshBasicMaterial({
          color
        }),
        new THREE.MeshBasicMaterial({
          color: 0xffffff
        }),
        new THREE.MeshBasicMaterial({
          color: 0xffffff
        }),
        new THREE.MeshBasicMaterial({
          color
        }),
        new THREE.MeshBasicMaterial({
          color
        })
      ]
      let wall = new THREE.Mesh(wallGeometry, wallMaterials)
      wall.position.set(px, py, pz)
      wall.rotation.y = ry
      wall.updateMatrix()
      let wallBSP = CSG.fromMesh(wall)
      if (window) {
        // 挖洞
        const { w, h, offsetX = 0, offsetZ = 0 } = window
        const glass = new THREE.Mesh(new THREE.BoxGeometry(w, h, depth))
        glass.position.set(px + offsetX, py, pz + offsetZ)
        glass.rotation.y = ry
        glass.updateMatrix()
        const glassBSP = CSG.fromMesh(glass)
        wallBSP = wallBSP.subtract(glassBSP)
        // 添加玻璃窗
        this.createWindow(wallConfig, window)
      }
      if (doors && doors.length) {
        for (let i = 0; i < doors.length; i++) {
          const { w, h, offsetX = 0, offsetZ = 0 } = doors[i]
          // 挖洞
          const doorGeometry = new THREE.BoxGeometry(w, h, depth)
          const door = new THREE.Mesh(doorGeometry)
          door.position.set(px + offsetX, py, pz + offsetZ)
          door.rotation.y = ry
          door.updateMatrix()
          const doorBSP = CSG.fromMesh(door)
          wallBSP = wallBSP.subtract(doorBSP)
          // 添加门
          this.createDoor(wallConfig, doors[i])
        }
      }
      if (window || doors) {
        const meshResult = CSG.toMesh(wallBSP, wall.matrix, wall.material)
        this.scene.add(meshResult)
      } else {
        this.scene.add(wall)
      }
    }
  }
  createWindow(wall, option) {
    const { pz, px, py, ry, depth } = wall
    const { w, h, offsetX = 0, offsetZ = 0, color, opacity } = option
    // 玻璃窗
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, depth),
      new THREE.MeshBasicMaterial({
        color,
        opacity,
        transparent: true,
        side: THREE.DoubleSide
      })
    )
    // 保持和墙壁同一位置
    glass.position.set(px + offsetX, py, pz + offsetZ)
    glass.rotation.y = ry
    this.scene.add(glass)
  }
  createDoor(wall, option) {
    const { pz, px, py, ry, depth } = wall
    const { w, h, offsetX = 0, offsetZ = 0 } = option
    // 门框
    const doorFramMaterial = new THREE.MeshBasicMaterial({ color: 0xc5cfd9 })
    const doorFramTop = new THREE.Mesh(new THREE.BoxGeometry(w + 1, 1, depth + 2), doorFramMaterial)
    doorFramTop.position.set(0, h / 2, 0)
    const doorFramRight = new THREE.Mesh(new THREE.BoxGeometry(1, h + 1, depth + 2), doorFramMaterial)
    doorFramRight.position.set(w / 2, 0, 0)
    const doorFramBottom = new THREE.Mesh(new THREE.BoxGeometry(w + 1, 1, depth + 2), doorFramMaterial)
    doorFramBottom.position.set(0, -(h / 2), 0)
    const doorFramLeft = new THREE.Mesh(new THREE.BoxGeometry(1, h + 1, depth + 2), doorFramMaterial)
    doorFramLeft.position.set(-(w / 2), 0, 0)
    // 门板
    const doorGeometry = new THREE.BoxGeometry(w, h, depth)
    const doorMaterial = [
      new THREE.MeshBasicMaterial({ color: 0xbbbbbb }),
      new THREE.MeshBasicMaterial({ color: 0xbbbbbb }),
      new THREE.MeshBasicMaterial({ color: 0xbbbbbb }),
      new THREE.MeshBasicMaterial({ color: 0xbbbbbb }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(doorOut) }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(doorIn) })
    ]
    const door = new THREE.Mesh(doorGeometry, doorMaterial)
    door.name = 'Door'
    door.dblclick = operateDoor
    door.position.set(-(w / 2), 0, 0)
    const doorRotate = new THREE.Group()
    doorRotate.name = 'DoorRotate'
    doorRotate.add(door)
    doorRotate.position.set(w / 2, 0, 0)
    const doorGroup = new THREE.Group()
    doorGroup.add(doorFramTop, doorFramRight, doorFramBottom, doorFramLeft, doorRotate)
    doorGroup.position.set(px + offsetX, py, pz + offsetZ)
    doorGroup.rotation.y = ry
    this.scene.add(doorGroup)
  }
}
const operateDoor = door => {
  const item = door.parent
  if (item.rotation.y === 0) {
    new TWEEN.Tween(item.rotation)
      .to(
        {
          y: item.rotation.y + Math.PI / 1.5
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
        1200
      )
      .easing(TWEEN.Easing.Elastic.Out)
      .start()
  }
}
