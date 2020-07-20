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
