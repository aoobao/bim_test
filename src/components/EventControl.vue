<script>
import register from '@/components/mixins/register'
import { EffectComposer } from '~plugin/postprocessing/EffectComposer'
import { RenderPass } from '~plugin/postprocessing/RenderPass.js'
import { OutlinePass } from '~plugin/postprocessing/OutlinePass.js';
export default {
  mixins: [register],
  data () {
    return {
    }
  },
  methods: {
    // 组件初始化方法
    init () {
      let renderer = this.getGlobalObject('renderer')
      let scene = this.getGlobalObject('scene')
      let camera = this.getGlobalObject('camera')
      let composer = this.global.$composer = new EffectComposer(renderer)

      let renderPass = this.global.$renderPass = new RenderPass(scene, camera)

      composer.addPass(renderPass)

      let width = this.global.$width
      let height = this.global.$height

      let outlinePass = this.global.$outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera)

      composer.addPass(outlinePass)


    },
    // 组件销毁方法.
    destroy () {

    }
  }
}
</script>
