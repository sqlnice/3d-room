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
const h = 100,
  depth = 4,
  py = 50,
  color = '#b2b4c5',
  doorWidth = 40,
  doorHeight = h - 5,
  windowHeight = h - 20,
  windowColor = 0x003333,
  windowOpacity = 0.4
export const walls = [
  {
    w: 800,
    h,
    depth,
    px: 0,
    py,
    pz: -300,
    color,
    ry: 0
  },
  {
    w: 600,
    h,
    depth,
    px: 400,
    py,
    pz: 0,
    color,
    ry: Math.PI / 2
  },
  {
    w: 800,
    h,
    depth,
    px: 0,
    py,
    pz: 300,
    color,
    ry: 0,
    window: {
      w: 600,
      h: windowHeight,
      offsetX: 50,
      offsetZ: 0,
      color: windowColor,
      opacity: windowOpacity
    },
    doors: [
      {
        w: doorWidth,
        h: doorHeight,
        offsetX: -270
      },
      {
        w: doorWidth,
        h: doorHeight,
        offsetX: 370
      }
    ]
  },
  {
    w: 600,
    h,
    depth,
    px: -400,
    py,
    pz: 0,
    color,
    ry: Math.PI / 2
  },
  {
    w: 600,
    h,
    depth,
    px: -300,
    py,
    pz: 0,
    color,
    ry: Math.PI / 2,
    window: {
      w: 540,
      h: windowHeight,
      offsetX: 0,
      offsetZ: 30,
      color: windowColor,
      opacity: windowOpacity
    },
    doors: [
      {
        w: doorWidth,
        h: doorHeight,
        offsetZ: -260
      }
    ]
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
  { w: 30, h: h - 10, depth: 15, px: -360, py: 45, pz: -180 },
  { w: 30, h: h - 10, depth: 15, px: -360, py: 45, pz: -60 },
  { w: 30, h: h - 10, depth: 15, px: -360, py: 45, pz: 60 },
  { w: 30, h: h - 10, depth: 15, px: -360, py: 45, pz: 180 }
]

const rackWidth = 40,
  rackHeight = 80,
  rackDepth = 40
/**
 * @typedef {Object} Rack
 * @property {number} w 宽度
 * @property {number} h 高度
 * @property {number} depth 厚度
 */
export const racks = [
  {
    w: rackWidth,
    h: rackHeight,
    depth: rackDepth,
    px: -100,
    py: rackHeight / 2,
    pz: -100,
    name: '机柜1号',
    usage: 0.2
  },
  { w: rackWidth, h: rackHeight, depth: rackDepth, px: 0, py: rackHeight / 2, pz: -100, name: '机柜2号', usage: 0.8 }
]
