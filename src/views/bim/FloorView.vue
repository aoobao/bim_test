<script>
import register from '@/components/mixins/register'
import SpotView from '@/components/Spot/index.vue'
import { mapGetters } from 'vuex'
let defaultPosition = [55.796038205524255, 49.488351999899635, -79.70864542596921]
export default {
  components: { SpotView },
  mixins: [register],
  render () {

    let list = this.pointList.map(t => {
      return <spot-view position={t.position} is-warning={t.isWarn} key={t.id} on-click={e => {
        this.spotClick(e, t)
      }} />
    })
    return (
      <div class="spot-view-container">
        {list}
      </div>
    )
  },
  data () {
    return {
      // count: 0
      pointList: []
    }
  },
  computed: {
    ...mapGetters(['deviceInfo'])
  },
  methods: {
    // 组件初始化方法
    init () {
      setTimeout(() => {
        // this.count = 5
        let list = []
        for (let i = 0; i < 5; i++) {
          let obj = {
            position: [Math.random() * 25 - Math.random() * 25, 1.5, Math.random() * 15 - Math.random() * 15],
            isWarn: i > 2,
            id: i + 1
          }
          list.push(obj)
        }
        this.pointList = list
      }, 500);
    },
    create (floor) {
      // console.log(floor)
      this.$mesh = floor
      this.$mesh.position.set(0, 0, 0)

      this.$addObject(this.$mesh)

      // 聚焦楼层
      let controls = this.getGlobalObject('orbitControls')
      // controls.setTarget(0, 0, 0, true)

      controls.setLookAt(...defaultPosition, 0, 0, 0, true)


    },
    spotClick (spot, obj) {
      // console.log(spot, index)
      // if (spot.isWarning()) {
      //   spot.hideWarning()
      // } else {
      //   spot.showWarning()
      // }


      this.$store.commit('setDeviceInfo', obj)
    },
    // 组件销毁方法.
    destroy () {

    }
  },
  watch: {
    deviceInfo (obj) {
      if (!obj) {
        // 还原大小
        let controls = this.getGlobalObject('orbitControls')
        controls.setLookAt(...defaultPosition, 0, 0, 0, true)
      } else {
        let position = obj.position
        let vpos = new THREE.Vector3(...position)

        let camera = this.getGlobalObject('camera')
        let p = camera.position
        let cpos = new THREE.Vector3(p.x, p.y, p.z)

        // cpos.sub(vpos)

        cpos.setLength(20)

        cpos.add(vpos)

        let controls = this.getGlobalObject('orbitControls')

        controls.setLookAt(cpos.x, cpos.y, cpos.z, ...position, true)
      }
    }
  }
}
</script>
