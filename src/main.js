// vue入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
// 设置axios请求默认根路径
axios.defaults.baseURL = 'http://127.0.0.1:8001/'
// 将axios挂在到Vue的原型对象上，这样每个组件都可以直接访问到$http,从而发起axios请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
