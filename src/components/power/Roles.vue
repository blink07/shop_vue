<template>
    <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片试图区域 -->
      <el-card>
        <!-- 添加角色按钮区域 -->
        <el-row>
          <el-col>
            <el-button type="primary">添加角色</el-button>
          </el-col>
        </el-row>
        <!-- 角色列表区域 -->
        <el-table :data="rolesList" border stripe>
          <!--展开列 展开属性expand-->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 一级权限， class 采用动态绑定，当每一行的都有下边框，让只有第一行有上边框 -->
              <el-row :class="['dbbottom', 'vcenter',i1 === 0 ? 'bdtop' : '']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                <!-- 渲染一级列表 -->
                <!--{{ scope.row.children }}-->
                <el-col :span="5">
                  <el-tag closable @close="removeRightsById(scope.row,item1.id)">{{ item1.per_name }}{{ i1 }}</el-tag>
                  <!--一级权限右边的箭头图标-->
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级和三级权限 -->
                <el-col :span="19">
                  <!-- 通过for循环嵌套渲染二级权限 -->
                  <el-row  :class="['vcenter', i2 === 0 ? '' : 'bdtop']" v-for="(item2, i2) in item1.children" :key="item2.id">
                    <!--二级权限-->
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeRightsById(scope.row,item2.id)">{{ item2.per_name }}{{ i2 }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!--三级权限-->
                    <el-col :span="18">
                      <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" closable @close="removeRightsById(scope.row,item3.id)">{{ item3.per_name }}{{ i3 }}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!--索引列-->
          <el-table-column type="index" label="#"></el-table-column>
          <!--角色名称列-->
          <el-table-column label="角色名称" prop="role_name"></el-table-column>
          <el-table-column label="角色描述" prop="role_descripte"></el-table-column>
          <el-table-column label="操作"  width="290px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" :value="scope.id" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-dialog
        title="权限分配"
        :visible.sync="showRightsVisible"
        width="40%"
        @close="setRightDialagClosed">
        <!--树形控件-->
        <el-tree :data="rightsList" :props="treeProps" ref="treeRef" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showRightsVisible= false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      // 所有角色列表
      rolesList: [],
      showRightsVisible: false,
      // 所有权限列表
      rightsList: [],
      treeProps: {
        children: 'sub_cat',
        label: 'per_name'
      },
      // 默认选中的节点ID值数组
      defKeys: [],
      // 当前即将分配权限的角色ID
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('/user/rolelist/')
      if (res.status !== 200) {
        return this.$message.error('获取角色列表失败')
      } else {
        console.log(res.payload)
        this.rolesList = res.payload
      }
    },
    // 根据id删除权限函数
    async removeRightsById (role, perId) {
      // 弹出确认删除框
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除，则返回值为字符串confirm
      // 如果用户取消了删除，则返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作~~')
      }
      console.log('确认删除~~')
      const { data: res } = await this.$http.delete(`/user/roles/${role.id}/rights/${perId}`)
      if (res.status !== 200) {
        return this.$message.error('权限删除失败~~')
      } else {
        this.$message.success('权限删除成功~~')
        // 当删除成功后如果请求this.getRolesList()会刷新整个列表，导致打开的权限列表关闭，
        // 所以让删除请求在删除后返回删除后的列表数据，并赋值给table内的列表对象
        console.log(res.payload)
        // res.payload返回该角色的现有权限列表，赋值给当前角色，做到不刷新页面，增加体验感
        role.children = res.payload
        // this.getRolesList()
      }
    },
    // 控制权限分配的对话框是否显示
    async showSetRightsDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('/menu/rights', { type: 'tree' })
      if (res.status !== 200) {
        return this.$message.error(res.message)
      } else {
        console.log(res.payload)
        this.rightsList = res.payload
      }
      console.log(this.defKeys)
      this.getLeafKeys(role, this.defKeys)
      this.showRightsVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到keyKeys数组中
    getLeafKeys (node, arr) {
      // 如果当前node节点不包括children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.permission_id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialagClosed () {
      this.defKeys = []
    },
    // 点击确认按钮，给角色分配权限
    async allotRights () {
      // console.log(this.$refs.treeRef.getCheckedKeys())
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const { data: res } = this.$http.post(`/user/${this.roleId}/rights/`, { keys: keys })
      if (res.status !== 200) {
        return this.$message.error('权限分配失败~~')
      } else {
        this.$message.success('权限分配成功~~')
      }
      this.getRolesList()
      this.showRightsVisible = false
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
/*给展开列的第一行加上上边框*/
.bdtop{
  border-top: 1px solid #E7EAED;
}
/*给展开列的每一行加下边框*/
.dbbottom{
  border-bottom: 1px solid #E7EAED;
}
/*让二级权限和一级权限在纵向上居中对齐*/
.vcenter{
  display: flex;
  align-items: center;
}
</style>
