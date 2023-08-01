<script setup>
import * as Three from 'three'
import { onMounted } from 'vue'
onMounted(() => {
  const scene = new Three.Scene()
  scene.background = new Three.Color(0x001111)
  const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5)
  camera.position.z = 5
  scene.add(camera)
  const geometry = new Three.BoxGeometry()
  const material = new Three.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new Three.Mesh(geometry, material)
  scene.add(cube)
  const renderer = new Three.WebGLRenderer({
    canvas: document.getElementById('three')
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
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
