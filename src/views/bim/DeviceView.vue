<script>
import register from '@/components/mixins/register'
import { MTLLoader } from '@/assets/three-plugin/loaders/MTLLoader'
import { OBJLoader } from '@/assets/three-plugin/loaders/OBJLoader'
export default {
  mixins: [register],
  data () {
    return {
    }
  },
  methods: {
    // 组件初始化方法
    init () {
      this.mtlloader = new MTLLoader()
      this.objloader = new OBJLoader()

    },
    createObject () {
      let mtlloader = this.mtlloader
      let objloader = this.objloader
      return new Promise(resolve => {
        mtlloader.setPath('./mesh/Camera/')
          .load('Camera.mtl', (materials) => {
            materials.preload()

            objloader.setMaterials(materials)
            objloader.setPath('./mesh/Camera/')
            objloader.load('Camera.obj', obj => {
              resolve(obj)
            })
          })
      })

    },
    async loadFloor (floor) {
      this.floor = floor
      let camera = await this.createObject()
      camera.position.set(0, 0, 3)
      // camera.scale.set(0.5, 0.5, 0.5)
      camera.rotation.z = 200 * Math.PI / 180
      this.floor.add(camera)

      // this.test(camera)
    },
    // test (camera) {
    //   let angle = camera.rotation.z
    //   angle += Math.PI / 180
    //   camera.rotation.z = angle
    //   setTimeout(() => {
    //     this.test(camera)
    //   }, 30);
    // },

    clear () {
      if (this.floor && this.floor.children.length > 0) {
        debugger
        this.floor.remove(...this.floor.children)
      }
    },
    // 组件销毁方法.
    destroy () {

    }
  }
}
</script>
