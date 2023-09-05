<script setup>
import * as Three from 'three'
import TWEEN from '@tweenjs/tween.js'
import { CSG } from 'three-csg-ts'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { onMounted } from 'vue'
import floorImage from '@/assets/floor.jpg'
import airImage from '@/assets/air.png'
import { walls, airs } from './data'
import { createWindow, createDoor, getOperateObject } from './util'
onMounted(() => {
  const canvas = document.getElementById('three')
  // 渲染器
  const renderer = new Three.WebGLRenderer({
    canvas
  })
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 场景
  const scene = new Three.Scene()
  scene.background = new Three.Color(0x001111)

  // 相机
  const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.set(0, 800, 400)
  scene.add(camera)
  const axesHelper = new Three.AxesHelper(500)
  scene.add(axesHelper)
  // 垂直向下看

  // 控制器
  const controls = new OrbitControls(camera, canvas)
  controls.update()

  // 绑定事件
  canvas.ondblclick = event => {
    const obj = getOperateObject(canvas, event, scene, camera)
    if (!obj) return
    if (typeof obj.dblclick === 'function') obj.dblclick(obj)
  }

  // 地面
  const texture = new Three.TextureLoader().load(floorImage, () => {
    texture.wrapS = texture.wrapT = Three.RepeatWrapping
    const repeatX = 2.4
    const repeatY = repeatX * (texture.image.height / texture.image.width)
    texture.repeat.set(repeatX, repeatY)
    const planeGeometry = new Three.PlaneGeometry(1200, 1000)
    const planeMaterial = new Three.MeshBasicMaterial({
      map: texture,
      side: Three.DoubleSide
    })
    const plane = new Three.Mesh(planeGeometry, planeMaterial)
    // 地面水平
    plane.rotation.x = Math.PI / 2
    scene.add(plane)
  })
  // 墙
  {
    for (let i = 0; i < walls.length; i++) {
      const wallOption = walls[i]
      const { w, h, depth, pz, px, py, color, ry, window, doors } = wallOption
      const wallGeometry = new Three.BoxGeometry(w, h, depth)
      const wallMaterials = [
        new Three.MeshBasicMaterial({
          color
        }),
        new Three.MeshBasicMaterial({
          color
        }),
        new Three.MeshBasicMaterial({
          color: 0xffffff
        }),
        new Three.MeshBasicMaterial({
          color: 0xffffff
        }),
        new Three.MeshBasicMaterial({
          color
        }),
        new Three.MeshBasicMaterial({
          color
        })
      ]
      let wall = new Three.Mesh(wallGeometry, wallMaterials)
      wall.position.set(px, py, pz)
      wall.rotation.y = ry
      wall.updateMatrix()
      let wallBSP = CSG.fromMesh(wall)
      if (window) {
        // 挖洞
        const { w, h, offsetX = 0, offsetZ = 0 } = window
        const glass = new Three.Mesh(new Three.BoxGeometry(w, h, depth))
        glass.position.set(px + offsetX, py, pz + offsetZ)
        glass.rotation.y = ry
        glass.updateMatrix()
        const glassBSP = CSG.fromMesh(glass)
        wallBSP = wallBSP.subtract(glassBSP)

        // 添加玻璃窗
        createWindow(scene, wallOption, window)
      }
      if (doors && doors.length) {
        for (let i = 0; i < doors.length; i++) {
          const { w, h, offsetX = 0, offsetZ = 0 } = doors[i]
          // 挖洞
          const doorGeometry = new Three.BoxGeometry(w, h, depth)
          const door = new Three.Mesh(doorGeometry)
          door.position.set(px + offsetX, py, pz + offsetZ)
          door.rotation.y = ry
          door.updateMatrix()
          const doorBSP = CSG.fromMesh(door)
          wallBSP = wallBSP.subtract(doorBSP)

          // 添加门
          createDoor(scene, wallOption, doors[i])
        }
      }
      if (window || doors) {
        const meshResult = CSG.toMesh(wallBSP, wall.matrix, wall.material)
        scene.add(meshResult)
      } else {
        scene.add(wall)
      }
    }
  }

  // 空调
  {
    for (let i = 0; i < airs.length; i++) {
      const air = airs[i]
      const { w, h, depth, pz, px, py } = air
      const airGeometry = new Three.BoxGeometry(w, h, depth)
      const texture = new Three.TextureLoader().load(airImage, () => {
        texture.wrapS = texture.wrapT = Three.RepeatWrapping
        texture.repeat.set(1, 1)
      })
      const airMaterials = [
        new Three.MeshBasicMaterial({
          color: 0xbbbbbb
        }),
        new Three.MeshBasicMaterial({
          color: 0xbbbbbb
        }),
        new Three.MeshBasicMaterial({
          color: 0xbbbbbb
        }),
        new Three.MeshBasicMaterial({
          color: 0xbbbbbb
        }),
        new Three.MeshBasicMaterial({
          map: texture
        }),
        new Three.MeshBasicMaterial({
          color: 0xbbbbbb
        })
      ]
      const airMesh = new Three.Mesh(airGeometry, airMaterials)
      airMesh.position.set(px, py, pz)
      airMesh.rotation.y = Math.PI / 2
      scene.add(airMesh)
    }
  }

  const render = () => {
    TWEEN.update()
    requestAnimationFrame(render)
    renderer.render(scene, camera)
  }
  requestAnimationFrame(render)
})
</script>

<template>
  <canvas id="three"></canvas>
</template>

<style scoped></style>
