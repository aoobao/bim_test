<template>
  <div class="right-float-container" :class="{show:this.isShow}">
    <template v-if="isShow">
      <slot></slot>
    </template>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    show () {
      this.isShow = true
    },
    hide () {
      this.isShow = false
    }
  }
}
</script>


<style lang="scss" scoped>
.right-float-container {
  width: 500px;
  height: 100vh;
  position: absolute;
  // right: 0;
  right: -500px;
  top: 0;
  background-color: #ffffff;
  transition: all 0.5s;
  overflow: auto;
  &.show {
    right: 5px;
  }
}
</style>
