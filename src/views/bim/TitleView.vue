<template>
  <div v-show="title" class="float-title-view">
    <span class="text">
      {{title}}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>
.float-title-view {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 50px;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  .text {
    padding: 8px 14px;
    background-color: #555;
    border-radius: 4px;
    color: #fff;
    font-size: 34px;
    text-align: center;
    min-width: 80px;
  }
}
</style>
