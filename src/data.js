/**
 * @typedef {Object} Wall
 * @property {number} w 宽度
 * @property {number} h 高度
 * @property {number} depth 厚度
 * @property {number} px x轴位置
 * @property {number} py y轴位置
 * @property {number} pz z轴位置
 * @property {string} color 颜色
 * @property {number} ry y轴旋转角度
 * @property {Object} window 窗户
 * @property {Object[]} doors 门
 */
const w = 400,
  h = 30,
  depth = 2,
  py = 15,
  color = '#b2b4c5'
export const walls = [
  {
    w,
    h,
    depth,
    px: 0,
    py,
    pz: -125,
    color,
    ry: 0
  },
  {
    w: 250,
    h,
    depth,
    px: 200,
    py,
    pz: 0,
    color,
    ry: Math.PI / 2
  },
  {
    w,
    h,
    depth,
    px: 0,
    py,
    pz: 125,
    color,
    ry: 0,
    window: {
      w: w - 100,
      h: h - 5,
      depth,
      offset: 40
    },
    doors: []
  },
  {
    w: 250,
    h,
    depth,
    px: -200,
    py,
    pz: 0,
    color,
    ry: Math.PI / 2
  },
  {
    w: 250,
    h,
    depth,
    px: -150,
    py,
    pz: 0,
    color,
    ry: Math.PI / 2,
    window: {
      w: 200,
      h: h - 5,
      depth,
      offset: 0
    },
    doors: []
  }
]

/**
 * @typedef {Object} Air
 * @property {number} w 宽度
 * @property {number} h 高度
 * @property {number} depth 厚度
 * @property {number} px x轴位置
 * @property {number} py y轴位置
 * @property {number} pz z轴位置
 */
export const airs = [
  { w: 15, h: 40, depth: 10, px: -180, py: 20, pz: -75 },
  { w: 15, h: 40, depth: 10, px: -180, py: 20, pz: -25 },
  { w: 15, h: 40, depth: 10, px: -180, py: 20, pz: 25 },
  { w: 15, h: 40, depth: 10, px: -180, py: 20, pz: 75 }
]
