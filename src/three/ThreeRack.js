import * as THREE from 'three'
import ThreeCore from './ThreeCore'
import Rack from '@/components/Rack.js'
export default class ThreeRack extends ThreeCore {
  init() {
    if (this.options.needBindEvent) {
      this.bindEvent()
    }
  }
  bindEvent() {
    this.canvas.ondblclick = event => {
      const obj = this.getOperateObject(event)
      if (!obj) return
      if (typeof obj.dblclick === 'function') {
        obj.dblclick(obj)
      }
    }
  }
  createRack(item) {
    const config = {
      ...item,
      config: {
        size: { w: 30, h: 88, d: 30 }, // 尺寸
        position: { px: 0, py: -44, pz: 0 },
        type: 'normal'
      }
    }
    new Rack(this.scene, config)
  }
}
