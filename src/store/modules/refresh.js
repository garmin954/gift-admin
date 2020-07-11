import Vue from 'vue'
const vue = new Vue()
const state = {
  isRouterAlive: true
}

const mutations = {

  REFRESH_ROUTE: state => {
    state.isRouterAlive = false
    vue.$nextTick(() => (state.isRouterAlive = true))
  }
}

const actions = {
  refreshRoute({ commit }) {
    commit('REFRESH_ROUTE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
