<script>
import register from '@/components/mixins/register'
import { GLTFLoader } from '@/assets/three-plugin/loaders/GLTFLoader'
import floorList from './floor'
import TitleView from './TitleView'
// import { getEventBus } from '@/assets/js/EventBus'
export default {
  components: { TitleView },
  mixins: [register],
  data () {
    return {
      warnFloor: [],
      selectFloor: null
    }
  },
  computed: {
    selectFloorName () {
      if (this.selectFloor) {
        return this.selectFloor.floorName
      }
      return null
    }
  },
  render () {
    return <title-view title={this.selectFloorName} />
  },
  methods: {
    getWarnFloorList () {
      let list = []
      for (let i = 0; i < floorList.length; i++) {
        const floor = floorList[i];
        if (floor.floorName !== 'ground' && floor.floorName !== '9F') {
          let z = Math.random()
          if (z < 0.2) {
            list.push(floor)
          }
        }
      }
      this.warnFloor = list
      this._warn_time_index = setTimeout(() => {
        this.getWarnFloorList()
      }, 5000);
    },

    selectMoveIn (obj) {
      let name = obj.userData.name
      // console.log(name)
      let floorItem = floorList.find(t => t.meshName === name)
      if (floorItem) {
        this.selectFloor = floorItem
      }
    },
    selectMoveOut () {
      this.selectFloor = null
    },
    // 组件初始化方法
    init () {
      let func = gltf => {
        // window.recordStart()
        // window.recordTime('init')
        let mesh = gltf.scene
        this.$mesh = mesh

        this.$floors = []
        this.$mesh.traverse(obj => {
          // console.log(obj)
          if (obj.isMesh) {
            if (!this.$defaultMaterial) {
              this.$defaultMaterial = obj.material.clone()
            }

            let data = obj.userData
            data.defaultColor = obj.material.color.getHex()
            let name = data.name
            let floor = floorList.find(t => t.meshName === name)
            if (floor) {
              this.$floors.push(obj)
              // obj.material.color.setHex(0xff0000)
            }
          }
        })

        // window.recordTime('mesh traverse')
        // 楼层选择管理
        let selectManager = this.global.$selectManager
        selectManager.init({
          objects: this.$floors,
          dblclick: this.floorDblClick,
          click: this.floorClick,
          moveIn: this.selectMoveIn,
          moveOut: this.selectMoveOut
        })

        // window.recordTime('selectmanager')
        // eventBus.on(this.$floors, 'dblclick', this.floorClick)
        this.$addObject(this.$mesh)

        // this.global.$scene.add(mesh)

        // 还原初始位置
        let controls = this.getGlobalObject('orbitControls')
        controls.reset(true)

        // 模拟报警楼层.
        this.getWarnFloorList()
        // window.recordTime('init over')

        this.$emit('init', gltf)
        // window.recordTime('init emit over')


      }
      let gltf = null
      if (this.globalModel) {
        gltf = this.globalModel.main
      }
      if (gltf) {
        func.call(this, gltf)
      } else {
        // 进度条开始
        progressJs().start()
        // setTimeout(() => {
        //   progressJs().set(30)
        // let dracoLoader = new THREE.DRACOLoader()
        // dracoLoader.setDecoderPath('mesh/yuanhua/')
        let loader = new GLTFLoader()
        // loader.setDRACOLoader(dracoLoader)
        loader.setPath('mesh/yuanhua/')
        loader.load('yuanhuabuilding.gltf', (obj) => {
          func.call(this, obj)
          setTimeout(() => {
            progressJs().end()
          }, 1000)
        }, this.loadOnProgress, this.onError)
        // }, 1000);
      }
    },
    render () {
      // console.log('render building')
      if (this.$alarmFloorList) {
        for (let i = 0; i < this.$alarmFloorList.length; i++) {
          const floor = this.$alarmFloorList[i]

          let data = floor.userData
          let opacity = data.opacity
          let step = data.isSub ? -0.02 : 0.02
          opacity += step

          if (opacity <= 0.5) {
            opacity = 0.5
            data.isSub = false
          } else if (opacity >= 1) {
            opacity = 1
            data.isSub = true
          }

          data.opacity = opacity

          floor.material.opacity = opacity
        }
      }
    },
    onError (e) {
      console.warn(e)
    },
    loadOnProgress (e) {
      // console.log(e)
      let total = e.total
      let loaded = e.loaded
      let progress = loaded / total

      progressJs().set(progress * 100)
    },
    getFloorMesh (meshName) {
      let floor = null
      this.$mesh.traverse(obj => {
        if (obj.type === 'Mesh') {
          let data = obj.userData
          let name = data.name
          if (name === meshName) {
            floor = obj
          }
        }
      })
      if (floor) {
        floor = floor.clone()
        floor.material = this.$defaultMaterial
      }
      return floor
    },

    floorClick (floor) {
      let name = floor.userData.name
      let floorItem = floorList.find(t => t.meshName === name)
      if (floorItem) {
        this.$emit('click', floorItem)
      } else {
        // 不应该不存在 error
        // debugger
      }
    },
    floorDblClick (floor) {
      let name = floor.userData.name
      let floorItem = floorList.find(t => t.meshName === name)
      if (floorItem) {
        // alert('你点击了' + floorItem.floorName)
        // console.log('双击事件:' + floorItem.floorName)
        this.$emit('dblClick', floorItem)
      } else {
        // 不应该不存在 error
        // debugger
      }
    },

    reset () {
      if (this.$mesh) {
        // this.showAllMesh(this.$mesh)
        this.$mesh.traverse(obj => {
          obj.visible = true
        })

        let camera = this.getGlobalObject('camera')
        camera.lookAt(0, 0, 0)
        let controls = this.getGlobalObject('orbitControls')
        controls.target = new THREE.Vector3(0, 0, 0)
        controls.update()

      }
    },
    hideBuilding () {
      let object = this.$mesh.children[0]
      let obj = object.children[0]
      obj.visible = false
    },
    showBuilding () {
      this.reset()
    },
    showFloor (floorName) {
      let floorItem = floorList.find(t => t.floorName === floorName)
      if (!floorItem) {
        console.warn('未找到楼层名称:' + floorName)
        return
      }
      this.showMesh(this.$mesh, floorItem)
      let camera = this.getGlobalObject('camera')
      camera.lookAt(0, 0, 0)
      let controls = this.getGlobalObject('orbitControls')
      controls.target = new THREE.Vector3(0, 0, 0)
      controls.update()
    },
    showMesh (object, floorItem, showOnly = false) {
      if (object.type === 'Mesh') {
        let name = object.name
        if (showOnly) {
          if (floorItem.meshName === name) {
            this.activeFloor = object
            object.visible = true
          } else {
            object.visible = false
          }
        } else {
          let floor = this.getFloorInfo(name)
          if (!floor) {
            // debugger
          } else {
            // 层数比目标楼层高的,隐藏掉.
            if (floor.sort > floorItem.sort) {
              object.visible = false
            } else {
              object.visible = true
            }
          }
        }
      } else if (object.type === 'Object3D') {
        // console.log(object, 'Object3D')
      }
      if (object.children.length > 0) {
        for (let i = 0; i < object.children.length; i++) {
          const obj = object.children[i];
          this.showMesh(obj, floorItem, showOnly)
        }
      }
    },
    getFloorInfo (name) {
      let item = floorList.find(t => t.meshName === name)
      if (!item) {
        console.warn('未找到floor', name)
      }
      return item
    },
    destroyMaterial () {
      if (this.$alarmFloorList && this.$alarmFloorList.length > 0) {
        this.$alarmFloorList.map(mesh => {
          let alarmMaterial = mesh.material
          mesh.material = this.$defaultMaterial
          alarmMaterial.dispose()
        })
        this.$alarmFloorList = null
      }
    },
    // 组件销毁方法.
    destroy () {
      if (this._warn_time_index) {
        clearTimeout(this._warn_time_index)
        this._warn_time_index = null
      }
      this.destroyMaterial()
      let selectManager = this.global.$selectManager
      selectManager.clear()

      window.recordEnd()
    }
  },
  watch: {
    warnFloor (list) {
      // 复原
      this.destroyMaterial()

      if (!this.$mesh) return

      if (list.length > 0) {
        let d = new Set(list.map(t => t.meshName))
        let alarmList = []
        this.$mesh.traverse(mesh => {
          if (mesh.isMesh) {
            let data = mesh.userData
            let name = data.name

            if (d.has(name)) {
              if (data.opacity == undefined) {
                data.opacity = 0.5 + Math.random() * 0.5  // 不透明度
                data.isSub = true
              }
              // mesh.material.color.setHex(0xff00000)
              mesh.material = this.$defaultMaterial.clone()
              mesh.material.transparent = true
              mesh.material.color.setHex(0xff0000)

              alarmList.push(mesh)
            }
          }
        })

        this.$alarmFloorList = alarmList
      }
    }
  }
}
</script>
