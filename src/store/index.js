import Vue from 'vue'
import Vuex from 'vuex'

import device from './modules/device'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  modules: {
    device
  },
  strict: debug
})
