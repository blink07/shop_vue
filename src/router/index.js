import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../components/Login'
import Home from '../components/Home'
Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
  {
    path: '/',
    redirect: '/login' // 重定向
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 表示将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() --> 放行  next('/login') --> 强制跳转
  if (to.path === '/login') return next() // login页面直接放行
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login') // 没有token强制转跳到登录页
  next() // 有token后直接放行
})

export default router
