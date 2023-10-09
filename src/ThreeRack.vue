<template>
  <div class="rack-container">
    <canvas id="three_rack"></canvas>
    <i class="rack-close" @click="$emit('closeRack')">x</i>
    <div class="info-container">
      <div class="card-header">{{ currentRack.name }}机柜</div>
      <div class="card-content">
        <img class="img" src="./assets/rack.png" alt="机柜缩略图" />
        <div class="card-item">
          <span>机柜名称：</span>
          <span>{{ currentRack.name }}</span>
        </div>
        <div class="card-item">
          <span>使用率：</span>
          <span>
            <progress max="100" :value="currentRack.usage * 100" style="margin-top: 2px"></progress>
          </span>
        </div>
      </div>
    </div>
    <div class="info-container server-info" v-if="currentServer.name">
      <div class="card-header">{{ currentServer.name }}</div>
      <div class="card-content">
        <img class="img" src="./assets/server.png" alt="主机缩略图" />
        <div class="card-item">
          <span>主机名称：</span>
          <span>
            <span class="name">{{ currentServer.name }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, defineProps, ref } from 'vue'
import ThreeRack from '@/three/ThreeRack.js'
const props = defineProps(['item'])
const currentRack = ref({ ...props.item })
let currentServer = ref({})
let threeRack
onMounted(() => {
  const options = {
    camera: {
      fov: 30,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      position: { x: 0, y: 120, z: 300 }
    },
    needBindEvent: true
  }
  threeRack = new ThreeRack(document.getElementById('three_rack'), options)
  const updateServerData = (data = {}) => {
    currentServer.value = data
  }
  threeRack.createRack(props.item, updateServerData)
})
</script>

<style lang="scss" scoped>
.rack-container {
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 5;
  transition: all 1s linear;
  .rack-close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 28px;
    color: #fff;
    cursor: pointer;
    &:hover {
      color: red;
    }
  }
}

.loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 20px;
}
.screen {
  .info-container {
    left: 10px;
    &.server-info {
      right: 10px;
    }
  }
}
.info-container {
  width: 287px;
  height: 420px;
  position: absolute;
  top: calc(50% - 210px);
  left: 100px;
  background: url('./assets/room_bg_item.png');
  background-size: 100% 100%;
  color: #fff;
  border-radius: 2px;
  &.server-info {
    left: auto;
    right: 100px;
  }
  .card-header {
    padding: 1px 15px;
    text-align: center;
    font-size: 18px;
  }
  .card-content {
    padding: 25px 15px;
    font-size: 14px;
    text-align: center;
    .img {
      height: 150px;
    }
    .card-item {
      margin-bottom: 10px;
      display: flex;
      & > span:nth-child(1) {
        width: 100px;
        text-align: right;
      }
      & > span:nth-child(2) {
        width: calc(100% - 100px);
        text-align: left;
        color: #eee;
        .name {
          display: inline-block;
          max-width: calc(100% - 18px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
