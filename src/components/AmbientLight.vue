<script>
import register from '@/components/mixins/register'
export default {
  mixins: [register],
  props: {
    name: {
      type: String,
      default: 'light'
    },
    intensity: {
      type: Number,
      default: 0.5
    }
  },
  data () {
    return {
      color: 0xffffff
    }
  },
  methods: {
    init () {
      // 环境光
      let name = `$${this.name}`

      this.global[name] = new THREE.AmbientLight(this.color, this.intensity);

      this.$addObject(this.global[name])

    },
    destroy () {
    }
  }
}
</script>
