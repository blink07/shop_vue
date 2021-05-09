<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png"/>
      </div>
      <!-- 表单区域 通过ref拿到表单实例对象-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0" class="login_form">
        <!-- 用户名 prop为验证规则的属性，即username对应验证规则的username -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <!-- 登录按钮 -->
          <el-button type="primary" @click="login">登录</el-button>
          <!-- 重置按钮 -->
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码不能小于 6 个字符', trigger: 'blur' }
        ]
        // 验证密码是否合法
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      // console.log(this)， resetFields为element-ui自带函数
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // 表单之前的预验证 validate函数为element-ui内自带函数，validate内为一个匿名箭头函数，参数为valid
      this.$refs.loginFormRef.validate(async (valid) => {
        console.log(valid)
        if (!valid) {
          return ''
        }
        const { data: res } = await this.$http.post('login/', this.loginForm) // 当一个函数的返回值为Promise时，可以使用异步,在回调函数上加上async， 在请求方法中加上await，这样简化返回值，不再返回Promise对象
        if (res.code !== 200) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 1.将登陆成功之后的token，保存到客户端的sessionStorage中
        // 1.1 项目中除了登录之外的其他的API接口，必须登录之后才能访问
        // 1.2 token只应在当前网站打开期间生效， 所以将token保存在sessionStorage中
        window.sessionStorage.setItem('token', res.token)
        // 2.通过编程式导航跳转到后台主页，路由地址时/home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 3px;//圆角边框
  // 将登录盒子定位到页面中间
  position: absolute;
  left: 50%;
  top: 50%;
  //因盒子设置了大小，定位后50%后并未直接到中间，transform进行位移
  transform: translate(-50%, -50%);//横轴和纵轴都位移-50%

  .avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;//设置盒子边框
    border-radius: 50%;//将盒子变成圆边框， 加了只有会发现盒子比图片小，所以里里面的图片也需要加
    padding: 10px;
    box-shadow: 0 0 10px #ddd;//给边框加阴影,向外扩散10像素
    //将头像的盒子摆到登录盒子的中间，先向右移动50%，再向左移动头像盒子的一半
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;//圆角边框
      background-color: #eee;
    }
  }
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;//此处后左边正常，右边超出20px，原因是该form表单默认为box-size main-contents所以需要设置box-sizing
  box-sizing: border-box;

}
.btns{
  display: flex;//变成弹性盒模型
  justify-content: flex-end;//横轴尾部对齐
}
</style>
