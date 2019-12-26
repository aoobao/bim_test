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
    init () {
      // 环境光
      let name = `$${this.name}`

      this.global[name] = new THREE.DirectionalLight(this.color, this.intensity)
      this.global[name].position.set(...this.position)

      this.$addObject(this.global[name])
    },
    destroy () {
    }
  }
}
</script>
