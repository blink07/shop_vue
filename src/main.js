// vue入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

// 导入Nprogress（进度条）包对应的JS和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'
// 设置axios请求默认根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8001/'
axios.defaults.baseURL = 'http://192.168.154.129:80/'

// 配置请求拦截器
// 在request拦截器中展示进度条（发起请求时展示，结束是消失）
axios.interceptors.request.use(config => {
  console.log(config)
  NProgress.start() // 展示进度条
  config.headers.Authorization = 'JWT ' + window.sessionStorage.getItem('token')
  // 必须return config，这个为固定写法
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done() // 进度条消失
  return config
})
// 将axios挂在到Vue的原型对象上，这样每个组件都可以直接访问到$http,从而发起axios请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
