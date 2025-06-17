<template>
  <div id="demo"></div>
</template>

<script>
console.log('ładuję seven')
import * as Three from 'three'

export default {
  data() {
    return {
      container: null,
      alpha: 0,
      nPoints: 100,
      gradient: [],
      points: [],
      points2: [],
      frame: null
    }
  },
  methods: {
    init() {
      this.container = document.getElementById('demo')
      this.scene = new Three.Scene()
      this.camera = new Three.PerspectiveCamera(
        75,
        this.container.clientWidth / this.container.clientHeight,
        0.01,
        50
      )
      this.camera.position.set(50, 5, 50)
      this.camera.lookAt(0, 5, 50)
      this.renderer = new Three.WebGLRenderer()
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      this.renderer.setClearColor(0xaabbcc)

      for (let i = 0; i < this.nPoints + 1; i++) {
        let row = []
        for (let j = 0; j < this.nPoints + 1; j++) {
          row.push(this.randomUnitVector())
        }
        this.gradient.push(row)
      }

      let x = Math.random(1)
      let y = Math.random(1)

      for (let i = 0; i < this.nPoints - 1; i++) {
        for (let j = 0; j < this.nPoints - 1; j++) {
          let w = this.perlinNoise(i + x, j + y)
          let s = this.perlinNoise(i + 1 + x, j + y)
          let t = this.perlinNoise(i + x, j + 1 + y)
          let r = this.perlinNoise(i + 1 + x, j + 1 + y)

          this.points.push(new Three.Vector3(i, w, j))
          this.points.push(new Three.Vector3(i + 1, s, j))
          this.points.push(new Three.Vector3(i, t, j + 1))
          this.points2.push(new Three.Vector3(i + 1, s, j))
          this.points2.push(new Three.Vector3(i + 1, r, j + 1))
          this.points2.push(new Three.Vector3(i, t, j + 1))
        }
      }

      let geometry = new Three.BufferGeometry()
      geometry.setFromPoints(this.points)
      let geometry2 = new Three.BufferGeometry()
      geometry2.setFromPoints(this.points2)

      let edges = new Three.EdgesGeometry(geometry)
      let material = new Three.LineBasicMaterial({ color: 0x00ff00 })
      let line = new Three.LineSegments(edges, material)
      this.scene.add(line)

      let edges2 = new Three.EdgesGeometry(geometry2)
      let material2 = new Three.LineBasicMaterial({ color: 0x0000ff })
      let line2 = new Three.LineSegments(edges2, material2)
      this.scene.add(line2)

      this.scene.fog = new Three.Fog(new Three.Color(0xaabbcc), 5, 40)

      this.container.appendChild(this.renderer.domElement)
    },
    animate() {
      this.alpha += 0.001
      this.frame = requestAnimationFrame(this.animate)
      this.camera.lookAt(50 + 50 * Math.sin(this.alpha), 5, 50 + 50 * Math.cos(this.alpha))
      this.renderer.render(this.scene, this.camera)
    },
    randomUnitVector() {
      let theta = Math.random() * 2 * Math.PI
      return { x: Math.cos(theta), y: Math.sin(theta) }
    },
    perlinNoise(x, y) {
      let x0 = Math.floor(x)
      let x1 = x0 + 1
      let y0 = Math.floor(y)
      let y1 = y0 + 1
      let sx = x - x0
      let sy = y - y0

      let n0, n1, ix0, ix1, intensity
      n0 = this.dotProductGrid(x0, y0, x, y)
      n1 = this.dotProductGrid(x1, y0, x, y)
      ix0 = this.linInterp(n0, n1, sx)
      n0 = this.dotProductGrid(x0, y1, x, y)
      n1 = this.dotProductGrid(x1, y1, x, y)
      ix1 = this.linInterp(n0, n1, sx)
      intensity = this.linInterp(ix0, ix1, sy)

      return intensity
    },
    dotProductGrid(x, y, wx, wy) {
      let gVector = this.gradient[y][x]
      let dVector = { x: wx - x, y: wy - y }
      return gVector.x * dVector.x + gVector.y * dVector.y
    },
    linInterp(a0, a1, w) {
      return (1 - w) * a0 + w * a1 //a0 - w(a0-a1)
    }
  },
  mounted() {
    this.init()
    this.animate()
  },
  beforeUnmount() {
    cancelAnimationFrame(this.frame)
  }
}
</script>

<style scoped>
#demo {
  display: block;
  width: 80%;
  height: 80%;
  margin: auto;
  margin-top: 10vh;
}
</style>
