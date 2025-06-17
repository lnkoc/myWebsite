<template>
  <div id="demo"></div>
</template>

<script>
import * as Three from 'three'
export default {
  data() {
    return {
      container: null,
      alpha: 0,
      nPoints: 5,
      gradient: [],
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
      this.camera.position.set(5, 2, 5)
      this.camera.lookAt(2.5, 1, 2.5)
      this.renderer = new Three.WebGLRenderer()
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      this.renderer.setClearColor(0x000000)

      for (let i = 0; i < this.nPoints + 1; i++) {
        let row = []
        for (let j = 0; j < this.nPoints + 1; j++) {
          row.push(this.randomUnitVector())
        }
        this.gradient.push(row)
      }

      const geometry = new Three.CircleGeometry(0.05, 6)
      const material = new Three.MeshBasicMaterial({ color: 0xbbbbff })
      material.side = Three.DoubleSide

      for (let i = 0; i < this.nPoints - 0.05; i += 0.1) {
        for (let j = 0; j < this.nPoints - 0.05; j += 0.1) {
          let w = this.perlinNoise(i, j)
          let circle = new Three.Mesh(geometry, material)
          circle.position.set(i, w, j)
          circle.lookAt(i, -1, j)
          this.scene.add(circle)
        }
      }

      this.container.appendChild(this.renderer.domElement)
    },
    animate() {
      this.alpha += 0.001
      this.frame = requestAnimationFrame(this.animate)
      this.camera.position.x = 2.5 + 2.5 * Math.cos(this.alpha)
      this.camera.position.z = 2.5 + 2.5 * Math.sin(this.alpha)
      this.camera.lookAt(2.5, 1, 2.5)
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
