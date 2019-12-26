<script>
import register from '@/components/mixins/register'
import SpotView from './index.js'
export default {
  mixins: [register],
  props: {
    position: {
      type: Array,
      default () {
        return [0, 0, 0]
      }
    },
    isWarning: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // 组件初始化方法
    init () {
      this.$position = new THREE.Vector3(...this.position)
      let scene = this.getGlobalObject('scene')
      let camera = this.getGlobalObject('camera')
      let raycaster = this.getGlobalObject('raycaster')
      // console.log(scene, camera, SpotView)
      this.$object = new SpotView({
        position: this.position,
        scene,
        camera,
        raycaster,
        click: this.clickHandle
      })

      if (this.isWarning) {
        this.$object.setIsTop(true)
        this.$object.showWarning()
      }

      // this.$object.show()
    },
    clickHandle () {
      // alert('click')
      this.$emit('click', this.$object)
      // let isWarning = this.$object.isWarning()
      // if (!isWarning) {
      //   this.$object.showWarning()
      // } else {
      //   this.$object.hideWarning()
      // }
    },
    getObject () {
      return this.$object || null
    },
    // 组件销毁方法.
    destroy () {
      this.$object.destroy()
      this.$object = null
    }
  },
  watch: {
    position (val) {
      // this.$position.set(...val)
      this.$object.setPosition(val)
    },
    isWarning (flag) {
      if (this.$object) {
        if (flag) {
          this.$object.setIsTop(true)
          this.$object.showWarning()
        } else {
          this.$object.setIsTop(false)
          this.$object.hideWarning()
        }
      }
    }
  }
}
</script>
