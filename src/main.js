import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css'
import '@/assets/css/global.scss'
//progress bar
import '@/assets/plugin/progressjs/progressjs.css'
import '@/assets/plugin/progressjs/progress.js'

// import * as THREE from 'three';
import * as THREE from '~plugin/three.module.js'
window.THREE = THREE

Vue.config.productionTip = false

let time = null
let lastTime = null
let isStart = false
window.recordStart = function () {
  isStart = true
  lastTime = null
  time = null
}

window.recordEnd = function () {
  isStart = false
}

window.recordTime = function (msg) {
  if (!isStart) return false
  let timer = new Date().getTime()
  if (time === null) {
    time = timer
    console.log('start', time)
  } else {
    console.log(msg, timer - lastTime, timer - time)
  }
  lastTime = timer
  return true

}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
