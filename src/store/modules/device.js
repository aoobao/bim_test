// import axios from '@/assets/js/axios.js'
// import utils from '@/assets/js/utils.js'

const state = {
  deviceInfo: null
}
const getters = {
  deviceInfo: state => state.deviceInfo
}
const mutations = {
  setDeviceInfo(state, device) {
    state.deviceInfo = device
  }
}
const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
