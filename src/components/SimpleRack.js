import * as THREE from 'three'
import rackSkin from '@/assets/rack_skin.jpg'
import rackDoorServer from '@/assets/rack_door_server.png'
import { canvas2Texture } from '../three/util'
export default class CreateSimpleRack {
  constructor(scene, rack) {
    this.scene = scene
    this.init(rack)
  }
  init(rack) {
    const { w, h, depth, pz, px, py, color = 0x8e8e8e } = rack
    const rackGeometry = new THREE.BoxGeometry(w, h, depth)
    const texture = new THREE.TextureLoader().load(rackSkin)
    const rackMaterials = [
      new THREE.MeshBasicMaterial({
        color,
        map: new THREE.TextureLoader().load(rackDoorServer)
      }),
      new THREE.MeshBasicMaterial({
        color,
        map: texture
      }),
      new THREE.MeshBasicMaterial({
        color,
        map: canvas2Texture(rack.name, { width: w, height: depth })
      }),
      new THREE.MeshBasicMaterial({
        color,
        map: texture
      }),
      new THREE.MeshBasicMaterial({
        color,
        map: texture
      }),
      new THREE.MeshBasicMaterial({
        color,
        map: texture
      })
    ]
    const rackMesh = new THREE.Mesh(rackGeometry, rackMaterials)
    rackMesh.position.set(px, py, pz)
    rackMesh.hover = () => {}
    rackMesh.name = 'SimpleRack'
    rackMesh.userData = rack
    this.scene.add(rackMesh)
  }
}
