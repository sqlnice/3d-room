import ThreeCore from './ThreeCore'
import Rack from '@/components/Rack.js'
import Server from '@/components/Server.js'
import TWEEN from '@tweenjs/tween.js'
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
      if (obj.name === 'server') {
        const item = obj.parent
        if (item.position.z === 0) {
          this.updateServerData(item.userData)
          new TWEEN.Tween(item.position)
            .to({ z: item.position.z + 10 }, 500)
            .easing(TWEEN.Easing.Elastic.Out)
            .start()
        } else {
          this.updateServerData({})
          new TWEEN.Tween(item.position).to({ z: 0 }, 500).easing(TWEEN.Easing.Elastic.Out).start()
        }
      }
      if (typeof obj.dblclick === 'function') {
        obj.dblclick(obj)
      }
    }
  }
  createRack(item, updateServerData = () => {}) {
    new Rack(this.scene, item)
    this.updateServerData = updateServerData
    this.createServer(item)
  }
  createServer(item) {
    const { servers, w, h, depth } = item
    if (!servers.length) return
    const rackConfig = {
      w,
      h,
      depth
    }
    let startHeight = 0
    servers
      .reduce((res, cur) => {
        // 主机
        const config = {
          ...cur,
          py: startHeight + cur.h / 2,
          rackConfig
        }
        startHeight += cur.h + 2
        res.push(config)
        return res
      }, [])
      .map(item => {
        new Server(this.scene, item)
      })
  }
}
