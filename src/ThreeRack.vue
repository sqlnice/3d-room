<template>
  <div class="rack-container">
    <canvas id="three_rack"></canvas>
    <i class="rack-close" @click="$emit('closeRack')">x</i>
    <div class="info-container">
      <div class="card-header">{{ currentRack.name }}机柜</div>
      <div class="card-content">
        <img class="img" src="./assets/rack.png" alt="" />
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
    <!-- <div class="info-container server-info" v-if="currentServer.name">
      <div class="card-header">{{ currentServer.name }}</div>
      <div class="card-content">
        <img class="img" src="/scr-web/static/img/three_room/server.png" alt="" />
        <div class="card-item">
          <span>主机名称：</span>
          <span>
            <span class="name">{{ currentServer.name }}</span>
            <el-tooltip placement="top">
              <div slot="content" class="table-container">
                <el-table :data="currentServer.alarms" style="width: 800px">
                  <el-table-column prop="name" label="告警名称" show-overflow-tooltip> </el-table-column>
                  <el-table-column label="告警级别" show-overflow-tooltip width="90px">
                    <template v-slot="scope">
                      <AlarmStatusIcon :level="scope.row.level"> </AlarmStatusIcon>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="告警源"
                    show-overflow-tooltip
                    prop="targetName"
                    width="80px"></el-table-column>
                  <el-table-column label="告警内容" show-overflow-tooltip prop="remark"></el-table-column>
                  <el-table-column label="告警触发时间" show-overflow-tooltip prop="gmtCreate"></el-table-column>
                  <el-table-column label="已持续时长" show-overflow-tooltip prop="duration"></el-table-column>
                </el-table>
              </div>
              <i class="el-icon-warning alarm-info" v-if="currentServer.alarm"></i>
            </el-tooltip>
          </span>
        </div>
        <div class="card-item">
          <span>数据中心：</span>
          <span>{{ currentServer.dcname }}</span>
        </div>
        <div class="card-item">
          <span>所属机房：</span>
          <span>{{ currentServer.roomname }}</span>
        </div>
        <div class="card-item">
          <span>管理IP：</span>
          <span>{{ currentServer.manageIp }}</span>
        </div>
        <div class="card-item">
          <span>设备类别：</span>
          <el-tooltip :content="currentServer.category">
            <span>{{ currentServer.category }}</span>
          </el-tooltip>
        </div>
        <div class="card-item">
          <span>系统类别：</span>
          <span>{{ currentServer.osCategory }}</span>
        </div>
        <div class="card-item">
          <span>所属平台：</span>
          <span>{{ currentServer.vendorName }}</span>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { onMounted, defineProps, reactive } from 'vue'
import ThreeRack from '@/three/ThreeRack.js'
const props = defineProps(['item'])
const currentRack = reactive({ ...props.item })

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
  threeRack.createRack(props.item)
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
.alarm-info {
  color: #f56c6c;
  cursor: pointer;
  margin-left: 4px;
  position: relative;
  top: -4px;
}
.table-container {
  background: #080e2b;
  ::v-deep {
    .el-table {
      th,
      tr,
      td {
        background: #303133;
        color: #fff;
      }
      &.el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: rgba(#303133, 0.9);
      }
      &::before {
        display: none;
      }
      td,
      th {
        border-bottom: 1px solid rgba(#fff, 0.05);
      }
    }
  }
}
</style>
