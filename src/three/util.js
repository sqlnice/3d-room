import * as THREE from 'three'

/**
 * 重置渲染器大小
 * @param {*} renderer 渲染器
 * @param {*} ignorePixeRatio  是否忽略像素比
 */
export const resizeRendererToDisplay = (renderer, ignorePixeRatio = false) => {
  const canvas = renderer.domElement
  const pixeRatio = ignorePixeRatio ? 1 : window.devicePixelRatio
  const width = (canvas.clientWidth * pixeRatio) | 0
  const height = (canvas.clientHeight * pixeRatio) | 0
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

/**
 * 文字转纹理
 * @param {*} text
 * @param {*} options
 * @returns THREE.Texture
 */
export const canvas2Texture = (text, options) => {
  const { width, height, font = '20px SimHei', color = '#00ffff', fillColor = '#777' } = options
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = fillColor
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = color
  ctx.font = font
  ctx.textBaseline = 'middle'
  const txtWidth = ctx.measureText(text).width
  ctx.fillText(text, width / 2 - txtWidth / 2, height / 2)
  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true
  return texture
}
