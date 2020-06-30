<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 @clear事件在清空输入框时触发-->
          <el-input placeholder="请输入内容" clearable class="input-with-select" v-model="queryInfo.search" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="usersList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role.role_name"></el-table-column>
        <el-table-column label="状态" prop="is_active">
          <!-- 通过作用域插槽拿到当前行的所有数据，再通过is_active属性控制开关的状态 -->
          <template slot-scope="scope">
            <!-- scope.row就是这一行的所有数据 -->
            <el-switch
              v-model="scope.row.state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <!-- 内容主题区域 ref表示el-form的引用名称-->
      <el-form :model="addUserForm" :rules="addUserFormRule" ref="addUserFormRef" label-width="70px">
        <!-- prop为验证规则的属性 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户的信息的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="30%" :close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="userInfoUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'users',
  data () {
    // 检验邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/
      if (regEmail.test(value)) {
        return callback()
      } else {
        return callback(new Error('邮箱格式不正确'))
      }
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        return callback(new Error('电话号码不合法'))
      }
    }
    return {
      // 获取用户列表的参数
      queryInfo: {
        search: '',
        // 当前的页数query
        pagenum: 1,
        pagesize: 2
      },
      usersList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      dialogVisible: false,
      // 添加用户的表单数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则
      addUserFormRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在3~20个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在6~20个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制编辑用户对话框显示与隐藏
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/users/', { params: this.queryInfo })
      if (res.status !== 200) return this.$message.error(res.message)
      this.usersList = res.payload.results
      this.total = res.payload.total
    },
    // 监听page size改变的事件 TODO 后台需要改动按需查找数据
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      console.log()
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 更新用户状态
    async userStateChanged (userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(`/user/statechange/${userinfo.id}/`, { state: userinfo.state })
      if (res.status !== 200) {
        userinfo.state = !userinfo.state
        return this.$message.error(res.message)
      }
      this.$message.success(res.message)
    },
    // 监听添加用户添加得到对话框事件，当关闭对话框时重置表单
    dialogClose () {
      // this.$refs.addUserFormRef为拿到表单的引用对象
      this.$refs.addUserFormRef.resetFields()
    },
    // 点击按钮， 添加新用户
    addUser () {
      // 对表单进行预验证,验证不通过时不能提交表单
      this.$refs.addUserFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) {
          return ''
        } else {
          // 验证通过发起对后台API的网络请求
          const { data: res } = await this.$http.post('user/register/', this.addUserForm)
          if (res.status !== 200) {
            this.$message.error(res.message)
          } else {
            this.$message.success('提交成功~~')
            // 添加成功后隐藏对话框
            this.dialogVisible = false
            // 刷新用户列表数据
            this.getUserList()
          }
        }
      })
    },
    // 编辑用户的对话框
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('user/userinfo/' + id.toString())
      if (res.status !== 200) {
        return this.$message.error(res.message)
      } else {
        this.editForm = res.payload
      }
    },
    async userInfoUpdate () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return ''
        } else {
          const { data: res } = await this.$http.put('user/userinfo/' + this.editForm.id, this.editForm)
          if (res.status !== 200) {
            return this.$message.error('更新失败')
          } else {
            this.editDialogVisible = false
            this.getUserList()
            this.$message.success('更新成功')
          }
        }
      })
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 删除用户
    async removeUserById (id) {
      // 弹出提示框询问是否进行删除操作， 为Element-ui的Message-Box组件提供，this.$confirm和this.$message一样是通过全局挂载方式引入的
      const confirm = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err) // catch 捕获错误消息后返回错误对象，函数体只有一行代码可以简写，将大括号和retuen删除
      // 如果用户确认删除，则返回值为字符串confirm
      // 如果用户取消了删除，则返回字符串cancel
      console.log(confirm)
      if (confirm !== 'confirm') {
        return this.$message.info('已取消删除操作~~')
      }

      const { data: res } = await this.$http.delete('user/userinfo/' + id)
      if (res.status !== 200) {
        return this.$message.error('用户删除失败~~')
      } else {
        this.$message.success('用户删除成功')
        this.getUserList()
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
