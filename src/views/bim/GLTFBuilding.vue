<script>
import register from '@/components/mixins/register'
import GLTFLoader from '@/assets/three-plugin/loaders/GLTFLoader'
import floorList from './floor'
// import { getEventBus } from '@/assets/js/EventBus'
// import DeviceView from './DeviceView'
export default {
  mixins: [register],
  data () {
    return {
      warnFloor: []
    }
  },
  methods: {
    // 组件初始化方法
    init () {
      // 模拟报警楼层.
      setTimeout(() => {
        this.warnFloor = [{
          meshName: 'node_3f_-4644',
          floorName: '3F'
        }, {
          meshName: 'node_6f_-4650',
          floorName: '6F'
        }]
      }, 3000);

      let func = gltf => {
        let mesh = gltf.scene
        this.$mesh = mesh

        this.$floors = []
        this.$mesh.traverse(obj => {
          // console.log(obj)
          if (obj.type === 'Mesh') {
            if (!this.$alarmMaterial) {
              this.$alarmMaterial = obj.material.clone()
              this.$alarmMaterial.color.setHex(0xff0000)
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

        // 楼层选择管理
        let selectManager = this.global.$selectManager
        selectManager.init({
          objects: this.$floors,
          dblclick: this.floorDblClick
        })

        // eventBus.on(this.$floors, 'dblclick', this.floorClick)

        this.$addObject(this.$mesh)

        // 还原初始位置
        let controls = this.getGlobalObject('orbitControls')
        controls.reset(true)



        this.$emit('init', gltf)
      }
      let gltf = null
      if (this.globalModel) {
        gltf = this.globalModel.main
      }
      if (gltf) {
        func(gltf)
      } else {
        // 进度条开始
        progressJs().start()
        // setTimeout(() => {
        //   progressJs().set(30)
        let loader = new GLTFLoader().setPath('mesh/yuanhua/')
        loader.load('yuanhuabuilding.gltf', (obj) => {

          func(obj)
          setTimeout(() => {
            progressJs().end()
          }, 1000)
        }, this.loadOnProgress)
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
          let step = data.isSub ? -0.05 : 0.05
          opacity += step

          if (opacity <= 0) {
            opacity = 0
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
      if (floor) floor = floor.clone()
      return floor
    },

    floorDblClick (floor) {
      let name = floor.userData.name
      let floorItem = floorList.find(t => t.meshName === name)
      if (floorItem) {
        // alert('你点击了' + floorItem.floorName)
        // console.log('双击事件:' + floorItem.floorName)
        this.$emit('select', floorItem)
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
    // showAllMesh (obj) {
    //   obj.visible = true
    //   if (obj.children.length > 0) {
    //     for (let i = 0; i < obj.children.length; i++) {
    //       const object = obj.children[i];
    //       this.showAllMesh(object)
    //     }
    //   }
    // },
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
    // 组件销毁方法.
    destroy () {
      let selectManager = this.global.$selectManager
      selectManager.clear()
    }
  },
  watch: {
    warnFloor (list) {
      // 复原
      this.$mesh.traverse(mesh => {
        if (mesh.isMesh) {
          let data = mesh.userData
          mesh.material.color.setHex(data.defaultColor)
          mesh.material.opacity = 1
        }
      })

      if (list.length > 0) {
        let d = new Set(list.map(t => t.meshName))
        let alarmList = []
        this.$mesh.traverse(mesh => {
          if (mesh.isMesh) {
            let data = mesh.userData
            let name = data.name

            if (d.has(name)) {
              if (data.opacity == undefined) {
                data.opacity = Math.random()  // 不透明度
                data.isSub = true
              }
              // mesh.material.color.setHex(0xff00000)
              mesh.material = this.$alarmMaterial.clone()
              mesh.material.transparent = true

              alarmList.push(mesh)
            }
          }
        })

        this.$alarmFloorList = alarmList
      } else {
        this.$alarmFloorList = null
      }
    }
  }
}
</script>
