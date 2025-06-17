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
      nPoints: 15,
      gradient: [],
      points: [],
      camera: null,
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
      this.camera.position.set(7.5, 2.5, 7.5)
      this.camera.lookAt(7.5, 0, 15)
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

      let max = 0
      let min = 0
      let length = 0
      for (let i = 0; i < this.nPoints - 0.05; i += 0.1) {
        for (let j = 0; j < this.nPoints - 0.05; j += 0.1) {
          var yValue = 0
          yValue = this.perlinNoise(i, j)
          yValue += 0.5 * this.perlinNoise((i * 2) % 10, (j * 2) % 10)
          yValue += 0.25 * this.perlinNoise((i * 4) % 10, (j * 4) % 10)
          yValue += 0.125 * this.perlinNoise((i * 8) % 10, (j * 8) % 10)
          if (max < yValue) max = yValue
          if (min > yValue) min = yValue
          this.points.push(new Three.Vector3(i, yValue, j))
        }
        length++
      }

      const geometry = new Three.PlaneGeometry(15, 15, length - 1, length - 1)
      geometry.setFromPoints(this.points)
      geometry.computeVertexNormals()

      const mat = new Three.MeshPhysicalMaterial({ color: 0x959595 }) //, wireframe: true});
      mat.side = Three.DoubleSide

      const tr = new Three.Mesh(geometry, mat)
      this.scene.add(tr)

      const waterGeom = new Three.PlaneGeometry(15, 15)
      waterGeom.lookAt(0, 1, 0)
      let tab = [
        new Three.Vector3(0, 0, 0),
        new Three.Vector3(15, 0, 0),
        new Three.Vector3(0, 0, 15),
        new Three.Vector3(15, 0, 15)
      ]
      waterGeom.setFromPoints(tab)
      waterGeom.computeVertexNormals()
      const waterMat = new Three.MeshPhysicalMaterial({
        color: 0x6666dd,
        roughness: 0,
        transmission: 1,
        thickness: 0.5
      })
      waterMat.side = Three.DoubleSide
      const wg = new Three.Mesh(waterGeom, waterMat)
      this.scene.add(wg)

      const light = new Three.DirectionalLight(0xffffff)
      light.position.set(5, 2, 5)
      this.scene.add(light)
      const light2 = new Three.HemisphereLight(0x040404, 0x858585, 0.3)
      this.scene.add(light2)

      this.scene.fog = new Three.Fog(new Three.Color(0xaabbcc), 1, 7)

      this.container.appendChild(this.renderer.domElement)
    },
    animate() {
      this.alpha += 0.001
      this.frame = requestAnimationFrame(this.animate)
      this.camera.lookAt(7.5 + 7.5 * Math.sin(this.alpha), 0, 7.5 + 7.5 * Math.cos(this.alpha))
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
