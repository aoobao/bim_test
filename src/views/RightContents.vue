<template>
  <right-wrapper ref="wrapper">
    <div class="contents">
      <h1>详情</h1>
      <p>ID:{{info.id}}</p>
      <p>X:{{position[0]}}</p>
      <p>Y:{{position[1]}}</p>
      <p>Z:{{position[2]}}</p>
    </div>
  </right-wrapper>
</template>
<script>
import RightWrapper from './rightView/RightWrapper'
import { mapGetters } from 'vuex'
export default {
  components: { RightWrapper },
  computed: {
    ...mapGetters(['deviceInfo']),
    info () {
      return this.deviceInfo || {}
    },
    position () {
      return this.info.position || []
    }
  },
  watch: {
    deviceInfo (val) {
      if (val) {
        this.$refs.wrapper.show()
      } else {
        this.$refs.wrapper.hide()
      }
    }
  }
}
</script>
