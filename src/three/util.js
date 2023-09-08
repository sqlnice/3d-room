import { render } from 'vue'

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
