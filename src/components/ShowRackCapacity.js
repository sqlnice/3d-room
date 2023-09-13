import * as THREE from 'three'
export default class ShowRackCapacity {
  constructor(scene, rack) {
    this.scene = scene
    this.init(rack)
  }
  init(rack) {
    const { w, h: rackHeight, depth, pz, px, hosts = [] } = rack
    const rackGroup = new THREE.Group()
    rackGroup.position.set(px, 0, pz)
    rackGroup.name = 'RackCapacity'
    rackGroup.userData = rack
    let startHeight = 0
    hosts
      .reduce((res, cur, i) => {
        const { h } = cur
        // 主机
        const config = {
          h,
          py: startHeight + h / 2,
          color: 0xffffff
        }
        startHeight += h + 2
        if (i === hosts.length - 1 && startHeight < rackHeight) {
          // 最后一块有空余
          res.push({
            h: rackHeight - startHeight,
            py: startHeight + (rackHeight - startHeight) / 2,
            color: '#62CF63'
          })
        }
        res.push(config)
        return res
      }, [])
      .map(item => {
        const { h, py, color } = item
        const cubeGeometry = new THREE.BoxGeometry(w, h, depth)
        const cubeMaterial = new THREE.MeshLambertMaterial({
          color,
          transparent: true,
          opacity: 0.8,
          fog: false
        })
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cube.position.set(0, py, 0)
        rackGroup.add(cube)
      })
    this.scene.add(rackGroup)
  }
}
