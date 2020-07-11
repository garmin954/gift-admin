import store from '@/store'

export default {

  methods:{
    // 切换侧栏
    _toggleSideBar() {
      store.dispatch('app/toggleSideBar')
    },
  }
}
