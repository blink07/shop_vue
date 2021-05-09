<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img class="logo" src="../assets/logo.png"/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 折叠起来时宽度为64px， 展开时为200px-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 收缩左侧导航栏区域的button -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边导航栏区域 el-menus所有属性可查看element-ui的文档-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#00A1D6"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath">
          <!-- 一级菜单 循环菜单列表，v-for尽量提供一个唯一的的key属性, index动态绑定值，在前面加:, 同时index只接受字符串，需要将id转化为字符串-->
          <el-submenu :index="item.id.toString()" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 通过绑定的ID动态获取图标-->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+item2.path" v-for="item2 in item.sub_cat" :key="item2.id" @click="saveNavState('/'+item2.path)">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ item2.authName }}</span>
            </el-menu-item>
          </el-submenu >
        </el-menu>
      </el-aside>
      <!-- 右侧区域, 使用路由占位符导入子组件 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      iconsObj: { // 以及菜单不同模块的图标
        1: 'el-icon-s-custom',
        2: 'el-icon-key',
        3: 'el-icon-shopping-bag-1',
        4: 'el-icon-sell',
        5: 'el-icon-s-data'
      },
      // 是否折叠左侧导航栏
      isCollapse: false,
      // 被激活的链接地址， 在点击和点击后回来都要处于高亮状态
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menu/menus')
      console.log(res)
      if (res.status !== 200) return this.$message.error(res.message)
      this.menuList = res.payload
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态，当点击的导航栏处于高亮状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373D41;
  display: flex;
  justify-content: space-between; // flex布局，左右贴边对其
  padding-left: 0;
  align-items: center; // 让buttom上下居中
  color: #fff; // 字体颜色
  font-size: 20px;
  > div { //给el-header里面的div再加一个flex布局
    display: flex;
    align-items: center; //flex布局，纵向对齐，使div内的元素纵向对齐
    span{
      margin-left: 15px;
    }
  }
}
.logo{
  height: 38px;
  width: 38px;
  border-radius: 50%;
}
.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #EAEDF1;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em; // 让文本的字符间有间隔
  cursor: pointer; // 当鼠标放到该区域时让箭头变成小手
}
</style>
