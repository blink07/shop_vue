<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 添加商品分类区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialogVisible">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品分类展示区域 -->
      <tree-table class="treeTable" :data="categoryList" :columns="columns"
      :selection-type="false" :expand-type="false" :show-index="true" index-text="#" stripe border>
        <!--是否有效-->
        <template slot="is_active" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.is_active===true" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- table 排序列 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.category_type===1" size="mini">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.category_type===2" size="mini">二级</el-tag>
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>
        <template slot="operate" slot-scope="scope">
          <el-button type="success" size="mini" icon="el-icon-edit" @click="showEditdialog">{{ scope.row.id }}编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 编辑按钮对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="45%"
        @close="addCategoryClose">
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称：" prop="cate_name">
            <el-input v-model="addCateForm.cate_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- options 用来指定数据源-->
            <!-- props用来指定配置对象-->
            <!-- v-model用来绑定被选中的分类的id，因为三级分类上面有一级和二级分类所以需要存储多个id-->
            <!-- handleChange监听级联选择框的改变 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCategoryList"
              expand-trigger="hover"
              :props="cascaderProps"
              @change="handleChange" clearable></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCategory">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'cate',
  data () {
    return {
      // 查询参数
      queryInfo: {
        search: 1,
        pagesize: 5,
        pagenum: 1
      },
      // 商品分类列表数据
      categoryList: [],
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cate_name',
          width: '300px'
        },
        {
          label: '是否有效',
          // 表示当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'is_active'
        },
        {
          label: '排序',
          // 表示当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'sort'
        },
        {
          label: '操作',
          // 表示当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'operate'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addDialogVisible: false,
      // 添加商品分类表单对象
      addCateForm: {
        // 将要添加的分类名称
        cate_name: '',
        // 将要分类的父级ID
        cate_pid: 0,
        // 分类的级别,默认要添加的是1等级
        cate_level: 1
      },
      // 父级分类列表
      parentCategoryList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'id',
        label: 'cate_name',
        children: 'children',
        // 取消级联关系，单选选择任意一级选项
        checkStrictly: true
      },
      selectedKeys: [],
      addCateFormRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 获取商品分类列表数据
    this.getCategoryList()
  },
  methods: {
    // 获取商品分类列表数据
    async getCategoryList () {
      const { data: res } = await this.$http.get('/goods/categoryList', { params: this.queryInfo })
      if (res.status !== 200) {
        return this.$message.error('获取商品列表失败~~')
      }
      console.log(res.payload.results)
      this.categoryList = res.payload.results
      this.total = res.payload.total
    },
    // 监听pagesize的变化
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategoryList()
    },
    // 监听当前页码pagenum的变化
    handleCurrentChange (newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getCategoryList()
    },
    showAddDialogVisible () {
      this.getParentCategory()
      this.addDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCategory () {
      const { data: res } = await this.$http.get('/goods/categoryList', { params: { search: 1 } })
      if (res.status !== 200) {
        return this.$message.error('获取父级分类数据列表失败~')
      } else {
        this.parentCategoryList = res.payload
      }
    },
    showEditdialog () {
    },
    handleChange () {
      console.log(this.selectedKeys)
      // 如果selectedKeys长度大于零，则表示新添加的分类有父分类
      // 否则为一级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cate_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cate_level = this.selectedKeys.length + 1
      } else {
        this.addCateForm.cate_pid = 0
        this.addCateForm.cate_level = 1
      }
    },
    // 点击确定按钮、发起添加分类请求
    addCategory () {
      console.log(this.addCateForm)
      // 对提交的表单数据需要进行预校验
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('输入有误~')
        } else {
          const { data: res } = await this.$http.post('/goods/addCategory', this.addCateForm)
          if (res.status !== 200) {
            return this.$message.error('添加分类失败！！')
          } else {
            this.$message.success('添加分类成功！')
            this.getCategoryList()
          }
        }
      })
      this.addDialogVisible = false
    },
    // 监听添加分类的对话框的关闭事件
    addCategoryClose () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cate_pid = 0
      this.addCateForm.cate_level = 1
    }
  }
}
</script>

<style scoped lang="less">
.treeTable{
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
