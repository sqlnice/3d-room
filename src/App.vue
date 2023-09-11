<script setup>
import { onMounted } from 'vue'
import floorImage from '@/assets/floor.jpg'
import { walls, airs } from './data'
import ThreeRoom from '@/three/ThreeRoom.js'
let threeRoom
onMounted(() => {
  const options = {
    scene: {
      background: 0x001111
    },
    camera: {
      fov: 75,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 2000,
      position: { x: 0, y: 800, z: 400 },
      axesHelperSize: 500
    },
    floor: {
      image: floorImage
    },
    needBindEvent: true
  }
  threeRoom = new ThreeRoom(document.getElementById('three'), options)
  const configs = {
    walls,
    airs
  }
  threeRoom.createRoom(configs)
})
</script>

<template>
  <canvas id="three"></canvas>
</template>

<style scoped></style>
