<script setup>
import { onMounted, ref, reactive } from 'vue'
import floorImage from '@/assets/floor.jpg'
import { walls, airs, racks } from './data'
import ThreeRoom from '@/three/ThreeRoom.js'
import ThreeRack from './ThreeRack.vue'
const rackInfoStyle = reactive({
  top: '0px',
  left: '0px',
  display: 'none'
})
const currentRack = ref({})
const showRackInfo = (e, userData) => {
  const dom = document.getElementById('three')
  // 大屏机房不是全部容器且出在缩放
  const { left, top } = dom.getBoundingClientRect()
  rackInfoStyle.top = `${e.y - top}px`
  rackInfoStyle.left = `${e.x - left + 20}px`
  rackInfoStyle.display = 'block'
  currentRack.value = userData
}
const closeRackInfo = () => {
  rackInfoStyle.display = 'none'
}
let threeRoom
onMounted(() => {
  const options = {
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
    needBindEvent: true,
    hover: showRackInfo,
    closeHover: closeRackInfo
  }
  threeRoom = new ThreeRoom(document.getElementById('three'), options)
  const configs = {
    walls,
    airs
  }
  threeRoom.createRoom(configs)

  getRackList()
})

const rackVisible = ref(false)
const closeRack = () => (rackVisible.value = false)
const getRackList = () => {
  const configs = {
    racks,
    clickRack() {
      closeRackInfo()
      rackVisible.value = true
    }
  }
  threeRoom.createRack(configs)
}

const status = ref('')
const resetRack = () => {
  status.value = ''
}
const showRackUsage = () => {
  if (status.value === 'usage') return
  status.value = 'usage'
  threeRoom.showRackUsage(racks)
}
const showRackCapacity = () => {
  if (status.value === 'capacity') return
  status.value = 'capacity'
  threeRoom.showRackCapacity(racks)
}
const operateTemperature = () => {
  if (status.value === 'temperature') return
  status.value = 'temperature'
}
</script>

<template>
  <div class="room-container">
    <div class="rack-info" :style="rackInfoStyle">
      <div class="rack-header">{{ currentRack.name }}机柜</div>
      <div class="rack-content">
        <div class="rack-item">
          <span>机柜名称：</span>
          <span>{{ currentRack.name }}</span>
        </div>
        <div class="rack-item">
          <span>使用率：</span>
          <span>
            <progress max="100" :value="(currentRack.usage || 0) * 100" style="margin-top: 2px"></progress>
          </span>
        </div>
      </div>
    </div>
    <div class="tools">
      <button class="tool-item" title="重置" @click="resetRack">重置</button>
      <button class="tool-item" :class="{ active: status === 'usage' }" title="机柜使用率" @click="showRackUsage">
        机柜使用率
      </button>
      <button class="tool-item" :class="{ active: status === 'capacity' }" title="机柜容量" @click="showRackCapacity">
        机柜容量
      </button>
      <button
        class="tool-item"
        :class="{ active: status === 'temperature' }"
        title="温度云展示"
        @click="operateTemperature">
        温度云展示
      </button>
    </div>
    <canvas id="three"></canvas>
  </div>
  <ThreeRack :item="currentRack" v-if="rackVisible" @closeRack="closeRack"></ThreeRack>
</template>

<style scoped lang="scss">
.room-container {
  background: #101930;
  width: 100vw;
  height: 100vh;
  position: relative;
}
.rack-info {
  display: none;
  min-width: 200px;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 2px;
  .rack-header {
    background: #00818e;
    padding: 10px 15px;
  }
  .rack-content {
    padding: 15px;
    font-size: 12px;
    .rack-item {
      margin-bottom: 5px;
      display: flex;
      span:nth-child(1) {
        width: 60px;
        text-align: right;
      }
      span:nth-child(2) {
        flex: 1;
      }
    }
  }
}
.tools {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 10px;
  top: 100px;
  background: #5071c5;
  padding: 20px 5px;
  border-radius: 2px;
  .tool-item {
    cursor: pointer;
    margin-bottom: 10px;
    &.active {
      color: #03a9f4;
    }
  }
}
</style>
