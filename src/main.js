import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'

import FastClick from 'fastclick'

import toast from 'components/common/toast'

Vue.config.productionTip = false

//创建一个Vue实例作为事件总线，全局使用，组件之间距离太远的可以使用传递事件
//使用：将GoodsListItem.vue中的事件传递到Home.vue中
Vue.prototype.$bus = new Vue()

//解决移动端300ms延迟,安装后导入,就一行代码
FastClick.attach(document.body)

//安装toast插件
Vue.use(toast)

//使用懒加载插件
Vue.use(VueLazyLoad, {
  preLoad: 1,
  //占位图，就是没有显示出来的时候默认的图片
  loading: require('assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
