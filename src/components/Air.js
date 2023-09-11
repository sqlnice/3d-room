import * as THREE from 'three'
import airImage from '@/assets/air.png'
export default class CreateAir {
  constructor(scene, airs) {
    this.scene = scene
    this.init(airs)
  }
  init(airs) {
    for (let i = 0; i < airs.length; i++) {
      const airConfig = airs[i]
      const { w, h, depth, pz, px, py } = airConfig
      const airGeometry = new THREE.BoxGeometry(w, h, depth)
      const texture = new THREE.TextureLoader().load(airImage, () => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(1, 1)
      })
      const airMaterials = [
        new THREE.MeshBasicMaterial({
          color: 0xbbbbbb
        }),
        new THREE.MeshBasicMaterial({
          color: 0xbbbbbb
        }),
        new THREE.MeshBasicMaterial({
          color: 0xbbbbbb
        }),
        new THREE.MeshBasicMaterial({
          color: 0xbbbbbb
        }),
        new THREE.MeshBasicMaterial({
          map: texture
        }),
        new THREE.MeshBasicMaterial({
          color: 0xbbbbbb
        })
      ]
      const airMesh = new THREE.Mesh(airGeometry, airMaterials)
      airMesh.position.set(px, py, pz)
      airMesh.rotation.y = Math.PI / 2
      this.scene.add(airMesh)
    }
  }
}
