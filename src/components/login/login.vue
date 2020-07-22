<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt />
      </div>
      <!-- 登录表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
        <!-- 标语 -->
        <div class="title">
          <span class="title_word">欢迎登录网上药店管理系统</span>
        </div>
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入用户密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" round @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {},
      // 表单验证规则的对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 8,
            message: "用户名长度在 2 到 8 个字符",
            trigger: "blur"
          }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 8,
            message: "密码长度在 6 到 8 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 登录之前的表单验证
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        // 判断是否是jin用户，无需授权即可登录
        if (this.loginForm.username == "jin") {
          // console.log('判断是jin');
          this.logins(); //访问数据库匹配，发起登录请求
        } else {
          // console.log('判断是否授权');
          // 判断该用户是否授权
          this.$http
            .get("authorization", {
              params: { username: this.loginForm.username }
            })
            .then(res => {
              // console.log(res);
              if (res.data.meta.status != 200) {
                this.$message.error("该用户未授权");
              } else {
                // 授权后发起登录请求
                this.logins();
              }
            });
        }
      });
    },
    logins() {
      this.$http.post("logins", this.loginForm).then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          this.$message.error("用户名或密码错误！");
        } else {
          // console.log(res);
          // 使用token令牌，登录成功后，保存到客户端的sessionStorege中，
          // 仅限当前网站打开期间有效
          // 因此项目中其他页面的api接口也是在登录之后才可访问
          window.sessionStorage.setItem(
            "token",
            JSON.stringify(res.data.data.token)
          );
          // 将当前登录用户的 id、用户名、角色、token 保存到客户端的sessionStorege中，
          // 仅限当前网站打开期间有效
          window.sessionStorage.setItem(
            "id",
            JSON.stringify(res.data.data._id)
          );
          window.sessionStorage.setItem("username", res.data.data.username);
          // console.log(res.data.role)
          window.sessionStorage.setItem("role", res.data.data.role);
          var token = sessionStorage.getItem("token");
          // 判断token和id值是否正常保存到sessionStorage
          if (!token) {
            this.$notify.error({
              title: "错误！",
              message: "token值无法保存到sessionStorage，无法登录！"
            });
          } else {
            // this.$message.success("登录成功！");
            this.$router.replace({ path: "/home" });
            // console.log(res.data);
            var username = res.data.data.username;
            var position = res.data.data.position;
            var role = res.data.data.role;
            var jobNum = res.data.data.jobNum;
            return this.$notify.success({
              title: "登录成功！",
              message:
                "尊敬的 " +
                username +
                " [ " +
                jobNum +
                role +
                "] " +
                "欢迎登录网上药店管理系统！" +
                "您的职务是：" +
                position +
                "!"
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 500px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      border-radius: 80%;
      background-color: #fff;
    }
  }
}

.title {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;

  .title_word {
    font-size: 20px;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
