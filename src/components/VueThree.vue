<template>
  <div class="vue-three-container" ref="container">
    <template v-if="isRegister">
      <slot name="camera"></slot>
      <slot name="light"></slot>
      <slot></slot>
    </template>
  </div>
</template>
<script>
export default {
  name: 'vue-three',
  provide () {
    return {
      global: this.global
    }
  },
  data () {
    let global = {}
    return {
      global,
      isAnimate: true,
      width: 0,
      height: 0,
      isRegister: false
    }
  },
  mounted () {
    this._initThreejs()
    this.$emit('created')
    this.render()
  },
  destroyed () {
    if (this.animateIndex) {
      cancelAnimationFrame(this.animateIndex)
      this.animateIndex = null
    }
    if (this.global.$scene) {
      this.global.$scene.dispose()
      delete this.global.$scene
    }
  },
  methods: {
    getGlobalObject (name = null) {
      if (name !== null) {
        return this.global['$' + name] || this.global[name] || null
      } else {
        return this.global
      }
    },
    $addObject (...objs) {
      // console.log(objs)
      // debugger
      if (this.global.$scene) {
        this.global.$scene.add(...objs)
      } else {
        console.warn('add objects after created event!')
      }
    },
    $removeObject (...objs) {
      if (this.global.$scene) {
        this.global.$scene.remove(...objs)
      }
    },
    _initThreejs () {
      this.global.$scene = new THREE.Scene()
      this.global.$renderer = new THREE.WebGLRenderer({
        antialias: true
      })

      let height = this.$refs.container.offsetHeight
      let width = this.$refs.container.offsetWidth
      this.width = this.global.$width = width
      this.height = this.global.$height = height
      this.global.$renderer.setSize(width, height)

      this.$refs.container.appendChild(this.global.$renderer.domElement)

      this.isRegister = true

      window.addEventListener('resize', this.resetSize, false)
    },
    render () {
      let camera = this.global.$camera
      if (camera) {
        this.$emit('render')
        if (!this.global.$composer)
          this.global.$renderer.render(this.global.$scene, camera)
      }
      if (this.isAnimate) {
        this.animateIndex = requestAnimationFrame(this.render)
      }
    },
    resetSize () {
      if (this.global.$renderer) {
        this.height = this.$refs.container.offsetHeight
        this.width = this.$refs.container.offsetWidth
        this.global.$renderer.setSize(this.width, this.height)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.vue-three-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
