<script>
import register from '@/components/mixins/register'
import { FBXLoader } from '~plugin/loaders/FBXLoader'
export default {
  mixins: [register],
  data () {
    return {
      index: 0,
      index2: 0,
      roadList: [[-56.94947057583982, -0.4, -61.71593298978416], [-58.495736917593995, -0.4, 19.534345614854438], [64.09773474523308, -0.4, 19.41056709516709], [63.90864562988281, -0.4, -61.6121940612793]],
      roadList2: [[59.78413925030381, -0.4, -58.333801539998724], [-53.332796619208956, -0.4, -58.8894365661008], [-55.92865948942238, -0.4, 15.532859749439767], [60.46004546034977, -0.4, 16.05127182238912]]
      // roadList: [[64.60487650167823, -0.4, -61.56226582693373], [-57.410300260197026, -0.4, -59.24122437803837], [-56.28002892527456, -0.4, 18.9249884245749], [63.754147610103296, -0.4, 18.232968678607534]]
    }
  },
  methods: {
    // 组件初始化方法
    init () {

    },
    create () {
      let list = this.roadList.map(t => {
        return new THREE.Vector3(...t)
      })
      let curve = new THREE.CatmullRomCurve3(list, true, 'catmullrom', 0.02)

      let points = curve.getPoints(2500)
      this.$points = points

      let list2 = this.roadList2.map(t => {
        return new THREE.Vector3(...t)
      })
      curve.points = list2
      let points2 = curve.getPoints(1500)
      this.$points2 = points2
      // let geometry = new THREE.BufferGeometry().setFromPoints(points)

      // let material = new THREE.LineBasicMaterial({ color: 0xff0000 })

      // this.$line = new THREE.Line(geometry, material)

      // this.$addObject(this.$line)

      let loader = new FBXLoader()
      loader.load('mesh/car/Car.fbx', obj => {

        obj.scale.set(0.01, 0.01, 0.01)


        this.$car1 = obj
        this.$car2 = obj.clone()


        this.$addObject(this.$car1)
        this.$addObject(this.$car2)
      }, undefined, err => {
        console.warn(err)
      })
    },
    resetPosition () {
      let point = this.$points[this.index]

      let addIndex = this.index + 1
      if (addIndex >= this.$points.length) addIndex = 0
      let next = this.$points[addIndex]

      this.$car1.position.copy(point)
      this.$car1.lookAt(next)

      this.index = addIndex


      let point2 = this.$points2[this.index2]
      addIndex = this.index2 + 1
      if (addIndex >= this.$points2.length) addIndex = 0
      let next2 = this.$points2[addIndex]

      this.$car2.position.copy(point2)
      this.$car2.lookAt(next2)

      this.index2 = addIndex

    },
    // 组件销毁方法.
    destroy () {
      if (this.$car1) {
        this.$removeObject(this.$car1, this.$car2)
        this.$car1.children[0].geometry.dispose()
        this.$car2.children[0].geometry.dispose()
        this.$car1 = null
        this.$car2 = null
      }
    },
    // 有该方法时每次渲染会调用
    render () {
      if (this.$car1) {
        this.resetPosition()
      }
    }
  }
}
</script>
