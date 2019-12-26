<script>
import { addRender, removeRender } from '@/assets/js/RenderManager'
export default {
  render () { return null },
  inject: ['global', 'globalModel'],
  created () {
    typeof this.init === 'function' && this.init()
    if (typeof this.render === 'function') {
      addRender(this.render)
    }
  },
  beforeDestroy () {
    if (typeof this.render === 'function') {
      removeRender(this.render)
    }
    if (this.$mesh) {
      this.$removeObject(this.$mesh)
      if (this.$mesh.geometry) {
        this.$mesh.geometry.dispose()
      }

      if (this.$mesh.material) {
        this.$mesh.material.dispose()
      }

      if (typeof this.$mesh.dispose === 'function') {
        this.$mesh.dispose()
      } else {
        // debugger
      }


      // 材质 及 纹理的销毁 TODO
    }
    typeof this.destroy === 'function' && this.destroy()
  },
  methods: {
    getGlobalObject (name) {
      return this.global[`$${name}`] || this.global[name] || null
    },
    $addObject (...objs) {
      let addObject = this.$parent.$addObject
      if (typeof addObject === 'function') {
        addObject(...objs)
      } else {
        console.warn('parent vue component can not find method : $addObject')
      }
    },
    $removeObject (...objs) {
      let removeObject = this.$parent.$removeObject
      if (typeof removeObject === 'function') {
        removeObject(...objs)
      } else {
        console.warn('parent vue component can not find method : $removeObject')
      }
    }
  }
}
</script>
