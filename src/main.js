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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
