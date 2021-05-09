<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- :data 绑定数据源-->
      <el-table :data="rightsList" stripe border>
        <!-- 数据表格的索引列，即第一列的1、2、3、4-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="per_name"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.level === 1">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === 2">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data () {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created () {
    // 获取所有的权限
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('/menu/rights', { params: { type: 'list' } })
      if (res.status !== 200) {
        return this.$message.error('获取权限列表失败~')
      } else {
        console.log(res.payload)
        this.rightsList = res.payload
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
