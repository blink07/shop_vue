import Vue from 'vue'
import { Button, Input, Form, FormItem, Message } from 'element-ui' // Message为弹框提示组件
// 在创建项目时配置的按需导入，所以这里需要将需要的对象导入进来
// import {  } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 将Message挂载到Vue原型对象上，进行全局调用
Vue.prototype.$message = Message
