<script>
import register from '@/components/mixins/register'
import OrbitControls from '@/assets/three-plugin/OrbitControls'
export default {
  mixins: [register],
  props: {
    fov: {
      type: Number,
      default: 45
    },
    near: {
      type: Number,
      default: 1
    },
    far: {
      type: Number,
      default: 50000
    },
    position: {
      type: Array,
      default () {
        return [0, 0, 1000]
      }
    }
  },
  computed: {
    aspect () {
      let width = this.$parent.width
      let height = this.$parent.height
      if (height !== 0) {
        return width / height
      } else {
        return 1
      }
    },
    propertyValue () {
      return {
        fov: this.fov,
        aspect: this.aspect,
        near: this.near,
        far: this.far,
        position: this.position
      }
    }
  },
  methods: {
    init () {
      let camera = this.global.$camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far)
      camera.position.set(...this.position)
      camera.lookAt(this.global.$scene)
      // 绑定OrbitControls
      this.global.$orbitControls = new OrbitControls(camera, this.global.$renderer.domElement);

      this.$addObject(this.global.$camera)
      this.$emit('init')
    },
    destroy () {
      if (this.global.$orbitControls) {
        this.global.$orbitControls.dispose()
        delete this.global.$orbitControls
      }
    },
    render () {
      // required if controls.enableDamping or controls.autoRotate are set to true
      this.global.$orbitControls.update()
    }
  },
  watch: {
    propertyValue (opt) {
      let camera = this.global.$camera
      if (!camera) return
      camera.fov = opt.fov
      camera.aspect = opt.aspect
      camera.near = opt.near
      camera.far = opt.far
      camera.position.set(...opt.position)
      camera.lookAt(this.global.$scene)
      camera.updateProjectionMatrix()
    }
  }
}
</script>
