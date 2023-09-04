import * as Three from 'three'
import TWEEN from '@tweenjs/tween.js'
import doorIn from '@/assets/door_in.png'
import doorOut from '@/assets/door_out.png'
export const getOperateObject = (dom, event, scene, camera) => {
  event.preventDefault()
  const { offsetWidth, offsetHeight } = dom
  const { left, top } = dom.getBoundingClientRect()
  const scale = 1
  const raycaster = new Three.Raycaster()
  const mouse = new Three.Vector2()
  mouse.x = ((event.clientX - left) / scale / offsetWidth) * 2 - 1
  mouse.y = -((event.clientY - top) / scale / offsetHeight) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children, true)
  if (intersects.length) return intersects[0].object
  return null
}

export const createWindow = (scene, wall, option) => {
  const { pz, px, py, ry, depth } = wall
  const { w, h, offsetX = 0, offsetZ = 0, color, opacity } = option
  // 玻璃窗
  const glass = new Three.Mesh(
    new Three.BoxGeometry(w, h, depth),
    new Three.MeshBasicMaterial({
      color,
      opacity,
      transparent: true,
      side: Three.DoubleSide
    })
  )
  // 保持和墙壁同一位置
  glass.position.set(px + offsetX, py, pz + offsetZ)
  glass.rotation.y = ry
  scene.add(glass)
}

export const createDoor = (scene, wall, option) => {
  const { pz, px, py, ry, depth } = wall
  const { w, h, offsetX = 0, offsetZ = 0 } = option
  // 门框
  const doorFramMaterial = new Three.MeshBasicMaterial({ color: 0xc5cfd9 })
  const doorFramTop = new Three.Mesh(new Three.BoxGeometry(w + 1, 1, depth + 2), doorFramMaterial)
  doorFramTop.position.set(0, h / 2, 0)
  const doorFramRight = new Three.Mesh(new Three.BoxGeometry(1, h + 1, depth + 2), doorFramMaterial)
  doorFramRight.position.set(w / 2, 0, 0)
  const doorFramBottom = new Three.Mesh(new Three.BoxGeometry(w + 1, 1, depth + 2), doorFramMaterial)
  doorFramBottom.position.set(0, -(h / 2), 0)
  const doorFramLeft = new Three.Mesh(new Three.BoxGeometry(1, h + 1, depth + 2), doorFramMaterial)
  doorFramLeft.position.set(-(w / 2), 0, 0)
  // 门板
  const doorGeometry = new Three.BoxGeometry(w, h, depth)
  const doorMaterial = [
    new Three.MeshBasicMaterial({ color: 0xbbbbbb }),
    new Three.MeshBasicMaterial({ color: 0xbbbbbb }),
    new Three.MeshBasicMaterial({ color: 0xbbbbbb }),
    new Three.MeshBasicMaterial({ color: 0xbbbbbb }),
    new Three.MeshBasicMaterial({ map: new Three.TextureLoader().load(doorOut) }),
    new Three.MeshBasicMaterial({ map: new Three.TextureLoader().load(doorIn) })
  ]
  const door = new Three.Mesh(doorGeometry, doorMaterial)
  door.name = 'Door'
  door.dblclick = operateDoor
  door.position.set(-(w / 2), 0, 0)
  const doorRotate = new Three.Group()
  doorRotate.add(door)
  doorRotate.position.set(w / 2, 0, 0)
  const doorGroup = new Three.Group()
  doorGroup.add(doorFramTop, doorFramRight, doorFramBottom, doorFramLeft, doorRotate)
  doorGroup.position.set(px + offsetX, py, pz + offsetZ)
  doorGroup.rotation.y = ry

  scene.add(doorGroup)
}

const operateDoor = door => {
  const item = door.parent
  console.log(item.rotation.y)
  if (item.rotation.y == 0) {
    new TWEEN.Tween(item.rotation)
      .to(
        {
          y: door.rotation.y + Math.PI / 1.5
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
