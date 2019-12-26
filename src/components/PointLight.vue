<script>
import register from '@/components/mixins/register'
export default {
  mixins: [register],
  props: {
    name: {
      type: String,
      default: 'light'
    },
    color: {
      type: Number,
      default: 0xffffff
    },
    intensity: {
      type: Number,
      default: 1
    },
    distance: {
      type: Number,
      default: 0
    },
    decay: {
      type: Number,
      default: 1
    },
    position: {
      type: Array,
      default () {
        return [0, 0, -100]
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // 组件初始化方法
    init () {
      let name = `$${this.name}`
      this.global[name] = new THREE.PointLight(this.color, this.intensity, this.distance, this.decay)

      this.global[name].position.set(...this.position)

      this.$addObject(this.global[name])
    },
    // 组件销毁方法.
    destroy () {

    }
  }
}
</script>
