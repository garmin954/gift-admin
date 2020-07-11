const getDefaultState = () => {
  return {
    routes: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    commit('SET_ROUTES', [])
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

