<template>
  <right-wrapper ref="wrapper">
    <div v-if="deviceInfo !== null" class="contents">
      <h1>设备详情</h1>
      <p>ID:{{info.id}}</p>
      <p>X:{{position[0]}}</p>
      <p>Y:{{position[1]}}</p>
      <p>Z:{{position[2]}}</p>
    </div>
    <div v-else-if="floorInfo !== null">
      <h1>楼层详情</h1>
      <p>名称:{{floor.floorName}}</p>
    </div>
  </right-wrapper>
</template>
<script>
import RightWrapper from './rightView/RightWrapper'
import { mapGetters } from 'vuex'
export default {
  components: { RightWrapper },
  computed: {
    ...mapGetters(['deviceInfo', 'floorInfo', 'hasInfo']),
    info () {
      return this.deviceInfo || {}
    },
    position () {
      return this.info.position || []
    },
    floor () {
      return this.floorInfo || {}
    }
  },
  watch: {
    hasInfo (val) {
      if (val) {
        this.$refs.wrapper.show()
      } else {
        this.$refs.wrapper.hide()
      }
    }
  }
}
</script>
