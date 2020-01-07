<template>
  <div class="container">
    <container-view @render="render" @init="init" ref="view">
      <gltf-building v-if="level===1" ref="gltf" @click="getFloorInfo" @dblClick="selectFloor" @init="saveModel" />
      <car-view v-if="level === 1" ref="car" />
      <floor-view v-if="level===2" ref="floor" />
    </container-view>
    <div class="button-wrapper">
      <button class="button" @click="getCameraPosition">输出照相机位置</button>
      <!-- <template v-if="level  === 1">
        <button class="button" @click="hideBuilding">隐藏建筑</button>
        <button class="button" @click="showBuilding">显示建筑</button>
        <button v-for="floor in floorList" :key="floor.floorName" class="button" @click="showFloor(floor)">显示楼层:{{floor.floorName}}</button>
      </template> -->
    </div>
    <right-contents />
  </div>
</template>

<script>

import { getEventBus } from '@/assets/js/EventBus'
import ContainerView from '@/views/ContainerView'
import GltfBuilding from '@/views/bim/GLTFBuilding'
import floorList from '@/views/bim/floor'
import FloorView from '@/views/bim/FloorView'
import RightContents from '@/views/RightContents'
import CarView from '@/views/bim/CarView'
export default {
  name: 'home',
  components: {
    ContainerView,
    CarView,
    GltfBuilding,
    FloorView,
    RightContents
  },
  provide () {
    return {
      globalModel: this.globalModel
    }
  },
  data () {
    let globalModel = {}
    return {
      globalModel,
      level: 1,
      floorList,
      // isSave: false
    }
  },
  mounted () {
    // setTimeout(() => {
    //   this.$refs.car.create()
    // }, 2000);
  },
  beforeDestroy () {
    if (this.$event) {
      this.$event.removeRightClick(this.deleteDeviceInfo)
      this.$event.removeDblRightClick(this.levelBack)
    }
  },
  methods: {
    saveModel (obj) {

      // window.recordTime('save begin')
      this.globalModel.main = obj

      // window.recordTime('save end')
      this.$nextTick(() => {
        if (this.$refs.car) this.$refs.car.create()
      })

      // setTimeout(() => {
      //   let o = obj
      //   console.log(o)
      //   debugger
      // }, 2000);

      // window.recordTime('save function end')
    },
    init () {
      this.$event = getEventBus()
      if (this.$event) {
        this.$event.addRightClick(this.deleteDeviceInfo)
        this.$event.addDblRightClick(this.levelBack)
      }
    },
    levelBack () {
      if (this.level > 1) {
        this.level = this.level - 1
      }
    },
    deleteDeviceInfo () {
      this.$store.commit('clearInfo')
    },
    getFloorInfo (floor) {
      // console.log(floor)
      this.$store.commit('setFloorInfo', floor)
    },
    selectFloor (floor) {
      // console.log(floor)
      let obj = this.$refs.gltf.getFloorMesh(floor.meshName)
      if (obj) {
        this.level = 2
        this.$nextTick(() => {
          if (this.$refs.floor) this.$refs.floor.create(obj)
        })
      }
    },
    render () {
      // let composer = this.$refs.index.getGlobalObject('composer')
      // composer.render()
    },
    showFloor (floor) {
      // this.$refs.gltf.clearActiveFloor()
      let name = floor.floorName
      this.$refs.gltf.showFloor(name)
    },
    hideBuilding () {
      this.$refs.gltf.hideBuilding()
    },
    showBuilding () {
      this.$refs.gltf.showBuilding()
    },
    getCameraPosition () {
      let camera = this.$refs.view.getGlobalObject('camera')
      console.log([camera.position.x, camera.position.y, camera.position.z])
    }
  }
}
</script>
<style lang="scss" scoped>

.container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  // margin: 10vh auto;
  position: relative;
  .button-wrapper {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    .button {
      margin-top: 2px;
    }
  }
  .right-button-wrapper {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    .button {
      margin-top: 2px;
    }
  }

  .progress-container {
    width: 100%;
    height: 1px;
    position: absolute;
    top: 0;
    left: 0;
    // background-color: green;
  }
}
</style>
