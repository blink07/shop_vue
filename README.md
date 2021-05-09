# shop_vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 安装less-loader、less、element-ui、axios
可以通过进入cmd 输入vue ui 在图形界面中安装

### 配置
assets/global.css为全局样式表


### 对权限页面进行管控，使用路由导航守卫，参考router/index.js文件


### 左侧导航菜单为可配置菜单，菜单栏从后端获取



#### 分支操作，提交本地代码到git仓库并推到github
1. 检查现处于什么分支
git branch
2.如果正是当前开发的分支，提交到暂存分区
git add .
3.将所有代码提交该分支代码
git commit -m '提交说明'
4.提交代码到github
git push   # 如果github还没有该分支，则是git push -o origin 分支名字

5. 将代码合并到master分支
5.1 切换到master分支
git checkout master
5.2 合并分支到master
git merge 分支名
5.3将主分支master提交到github


### 生成打包报告
1.通过命令行参数的形式生成报告
vue-cli-service build --report


#### 部署
1.创建node服务器
a.创建一个文件夹，用编辑器打开，在终端运行npm init -y初始化一个包管理文件
b.安装express, npm i express -S
c.将编译的dist文件夹拷贝值新建的文件下面
d.在新建文件夹下创建app.js启动文件，文件内容如下
const express = require('express')
const app = express()

app.use(express.static('./dist'))
app.listen(80, () =>{
    console.log('server runing at http://127.0.0.1')
})
e.运行启动文件node .\app.js


2.开启gzip配置，可以减小文件体积，使传输速度更快
a.在服务器文件中安装相应包
npm install compression -D
b.导入包
const compression = require('compression');
c.启用中间件
app.use(compression())


3.使用pm2管理应用
a.在服务器中安装pm2：npm install pm2 -g
b.启动项目： pm2 start 启动文件 --name 自定义名称
c.查看运行项目:pm2 ls
d.重启：pm2 restart 名称
e.删除： pm2 delete 名称
