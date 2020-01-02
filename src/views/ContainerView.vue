<template>
  <div class="vue-three-container" ref="container">
    <template v-if="isRegister">
      <slot></slot>
    </template>
  </div>
</template>
<script>
import Stats from 'stats.js'
import { createEventBus, getEventBus } from '@/assets/js/EventBus'

// import { OrbitControls } from '~plugin/controls/OrbitControls'
import CameraControls from '~plugin/camera-controls/camera-controls'
// 后处理
import { EffectComposer } from '~plugin/postprocessing/EffectComposer'
import { RenderPass } from '~plugin/postprocessing/RenderPass.js'

//抗锯齿处理
import { ShaderPass } from '~plugin/postprocessing/ShaderPass.js'
import { FXAAShader } from '~plugin/shaders/FXAAShader.js'

// 色彩增强
// import { UnrealBloomPass } from '~plugin/postprocessing/UnrealBloomPass'

import { SelectManager } from '@/assets/js/SelectManager'
import { updateRender } from '@/assets/js/RenderManager'
import { setAppendElementBody } from '@/assets/js/BaseElement'
// import { OutlinePass } from '~plugin/postprocessing/OutlinePass.js'

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
      width: 0,
      height: 0,
      isRegister: false,
      // position: [75.84, 56.64, -170.25]
      position: [94.10075043136305, 39.459687968667765, -154.69210089578456]
    }
  },
  mounted () {
    CameraControls.install({ THREE: window.THREE })
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

    _initStats () {
      let stats = new Stats()

      stats.dom.style.left = 'auto'
      stats.dom.style.right = '5px'
      stats.dom.style.top = '5px'

      this.$refs.container.appendChild(stats.dom)
      let func = this.render
      stats.begin()
      this.render = () => {
        func()
        stats.update()
      }
    },

    _initThreejs () {
      let height = this.$refs.container.offsetHeight
      let width = this.$refs.container.offsetWidth
      // this.$refs.container.width = width
      // this.$refs.container.height = height
      this.width = this.global.$width = width
      this.height = this.global.$height = height

      this.global.$scene = new THREE.Scene()

      this.global.$scene.background = new THREE.Color(0xa0a0a0)
      // this.global.$scene.fog = new THREE.Fog(0xa0a0a0, 50, 400)

      this.global.$renderer = new THREE.WebGLRenderer({
        // precision: 'highp', // 着色器精度. 可以是 "highp", "mediump" 或者 "lowp".
        // canvas: this.$refs.container,  // 有点问题
        antialias: false,   // 是否执行抗锯齿。默认为false.
        // alpha: true,  // canvas是否包含alpha (透明度)。
      })

      // this.global.$renderer.setPixelRatio(window.devicePixelRatio)
      this.global.$renderer.setSize(width, height)

      this.$refs.container.appendChild(this.global.$renderer.domElement)

      setAppendElementBody(this.$refs.container)

      // 射线对象很多地方都会用到,放到global中
      this.global.$raycaster = new THREE.Raycaster()

      this.global.$clock = new THREE.Clock()

      // 初始化灯光
      this._initLight()
      // 初始化照相机
      this._initCamera()
      // 初始化轨道控制器
      this._initOrbitControls()
      // // 初始化事件通道
      this._initEventBus()
      // // 后处理管理器
      this._initComposer()

      // // 性能监测窗口
      this._initStats()

      this.isRegister = true

      window.addEventListener('resize', this.resetSize, false)

      this.$emit('init')

      this.clickTest()
    },
    _initEventBus () {
      let camera = this.getGlobalObject('camera')
      let dom = this.$refs.container
      let raycaster = this.getGlobalObject('raycaster')
      createEventBus({ dom, camera, raycaster })
    },
    _initLight () {
      // 添加环境光
      let ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      this.$addObject(ambientLight)

      // 平行光
      let directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(...this.position)

      let light2 = new THREE.DirectionalLight(0xffffff, 1)
      light2.position.set(...[84.70971085189085, 63.72576051432783, -107.45349722546739])

      this.$addObject(directionalLight)
      this.$addObject(light2)

    },
    _initCamera () {
      let camera = this.global.$camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 5000)
      camera.position.set(...this.position)
    },

    _initOrbitControls () {
      let camera = this.global.$camera
      // this.global.$orbitControls = new OrbitControls(camera, this.global.$renderer.domElement)
      this.global.$orbitControls = new CameraControls(camera, this.global.$renderer.domElement)
      let controls = this.global.$orbitControls
      controls.enableDamping = true;
      controls.dampingFactor = 0.15;

      // 记录初始位置
      controls.saveState()
    },
    // 后处理
    _initComposer () {

      let global = this.getGlobalObject()
      let renderer = this.getGlobalObject('renderer')

      global.$composer = new EffectComposer(renderer)

      let scene = this.getGlobalObject('scene')
      let camera = this.getGlobalObject('camera')
      let renderPass = this.global.$renderPass = new RenderPass(scene, camera)

      // 色彩增强
      // let bloomPass = new UnrealBloomPass(new THREE.Vector2(this.width, this.height), 0.15, 0, 0)

      // 抗锯齿
      let fxaaPass = this.global.$fxaaPass = new ShaderPass(FXAAShader)
      let pixelRatio = renderer.getPixelRatio()
      fxaaPass.material.uniforms['resolution'].value.x = 1 / (this.width * pixelRatio)
      fxaaPass.material.uniforms['resolution'].value.y = 1 / (this.height * pixelRatio)

      global.$composer.addPass(renderPass)
      // global.$composer.addPass(bloomPass)
      global.$composer.addPass(fxaaPass)

      let eventBus = getEventBus()
      global.$selectManager = new SelectManager({
        resolution: new THREE.Vector2(this.width, this.height),
        scene: global.$scene,
        camera: global.$camera,
        composer: global.$composer,
        eventBus: eventBus
      })
    },
    clickTest () {
      let dom = this.$refs.container
      let raycaster = this.getGlobalObject('raycaster')
      let camera = this.getGlobalObject('camera')
      let scene = this.getGlobalObject('scene')
      let clickPoints = []
      dom.addEventListener('click', (e) => {
        let x = e.offsetX
        let y = e.offsetY
        let dx = (x / this.width) * 2 - 1
        let dy = 1 - (y / this.height) * 2
        let vec2 = new THREE.Vector2(dx, dy)
        raycaster.setFromCamera(vec2, camera)

        const intersectedObjects = raycaster.intersectObjects(scene.children, true)
        if (intersectedObjects.length > 0) {
          let intersected = intersectedObjects[0]
          // console.log(intersected)
          let point = intersected.point
          clickPoints.push([point.x, point.y, point.z])
          console.log(JSON.stringify(clickPoints))
        }
      })
    },
    render () {
      this.$emit('render')
      const delta = this.global.$clock.getDelta()

      updateRender(delta)

      if (this.global.$orbitControls) {
        this.global.$orbitControls.update(delta)
      }

      if (!this.global.$composer) {
        this.global.$renderer.render(this.global.$scene, this.global.$camera)
      } else {
        this.global.$composer.render()
      }

      this.animateIndex = requestAnimationFrame(this.render)
    },
    resetSize () {
      if (this.global.$renderer) {
        this.height = this.$refs.container.offsetHeight
        this.width = this.$refs.container.offsetWidth

        let camera = this.getGlobalObject('camera')
        camera.aspect = this.width / this.height
        camera.updateProjectionMatrix()

        this.global.$renderer.setSize(this.width, this.height)
        this.global.$composer.setSize(this.width, this.height)

        // let pixelRatio = this.global.$renderer.getPixelRatio()

        let fxaaPass = this.global.$fxaaPass
        // fxaaPass.uniforms['resolution'].value.x = 1 / (this.width * pixelRatio);
        // fxaaPass.uniforms['resolution'].value.y = 1 / (this.height * pixelRatio);
        fxaaPass.uniforms['resolution'].value.set(1 / this.width, 1 / this.height)

        // TODO
        this.$emit('resetSize')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.vue-three-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
