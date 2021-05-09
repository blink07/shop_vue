module.exports = {
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/production-sub-path/'
  //   : '/'
  // 自定义打包入口
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main.js')
      // 通过externals加载外部CDN资源，减少包大小和加快运行速度
      // 1添加如下需要全局加载的资源
      // 2将以下资源在main.js中的的css和js文件添加到public/index.html的头部
      config.set('externals', {
        vue: 'Vue',
        // 'vue-router': 'VueRouter',
        axios: 'axios',
        // lodash: '_',
        // echarts: 'echarts',
        nprogress: 'NProgress'
        // 'vue-quill-editor': 'VueQuillEditor'
      })
      // config.plugin('html').tap(args => {
      //   args[0].isProd = true
      //   return args
      // })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      // config.plugin('html').tap(args => {
      //   args[0].isProd = true
      //   return args
      // })
    })
  }
}
