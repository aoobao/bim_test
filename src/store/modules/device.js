// import axios from '@/assets/js/axios.js'
// import utils from '@/assets/js/utils.js'

const state = {
  deviceInfo: null,
  floorInfo: null,
}
const getters = {
  deviceInfo: state => state.deviceInfo,
  floorInfo: state => state.floorInfo,
  hasInfo: (state, getter) => {
    return getter.deviceInfo !== null || getter.floorInfo !== null
  }

}
const mutations = {
  setDeviceInfo(state, device) {
    state.deviceInfo = device
  },
  setFloorInfo(state, floor) {
    state.floorInfo = floor
  },
  clearInfo(state) {
    state.deviceInfo = null
    state.floorInfo = null
  }

}
const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
