<script setup>
import * as Three from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { onMounted } from 'vue'
import floorImage from '@/assets/floor.jpg'
import { walls } from './data'
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
  const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 999)
  scene.add(camera)
  const axesHelper = new Three.AxesHelper(500)
  scene.add(axesHelper)
  // 垂直向下看
  camera.position.set(0, 150, 300)

  // 控制器
  const controls = new OrbitControls(camera, canvas)
  controls.update()

  // 地面
  const texture = new Three.TextureLoader().load(floorImage, () => {
    texture.wrapS = Three.RepeatWrapping
    texture.wrapT = Three.RepeatWrapping
    const repeatX = 2
    const repeatY = repeatX * (texture.image.height / texture.image.width)
    texture.repeat.set(repeatX, repeatY)
    const planeGeometry = new Three.PlaneGeometry(600, 500)
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
      const { w, h, depth, pz, px, py, color, ry } = walls[i]
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
      const wall = new Three.Mesh(wallGeometry, wallMaterials)
      wall.position.set(px, py, pz)
      wall.rotation.y = ry
      scene.add(wall)
    }
  }
  // 方块
  const geometry = new Three.BoxGeometry(100, 100)
  const material = new Three.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new Three.Mesh(geometry, material)
  scene.add(cube)

  const render = () => {
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
