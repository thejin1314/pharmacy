<template>
  <div class="personal_center">
    <el-container>
      <!-- 头部面包屑导航区域 -->
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home_page' }">
            <i class="el-icon-s-home">首页</i>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span class="el-icon-star-off">个人中心</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-container>
        <!-- 左侧 头像,个人信息  区域 -->
        <el-aside width="47%">
          <!-- 头像区域 -->
          <div class="aside_top">
            <el-avatar
              :size="100"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            ></el-avatar>

            <div class="change_msg">
              <el-button round @click="changepassworde">
                <span>修改密码</span>
              </el-button>
              <el-button round @click="changeinfo">
                <span>修改信息</span>
              </el-button>
            </div>
          </div>
          <!-- 个人基本信息 -->
          <div class="personal_info">
            <h1 class="el-icon-user">个人基本信息</h1>
            <div class="line">
              <h2>用户名：</h2>
              <span>{{info.username}}</span>
            </div>
            <div class="line">
              <h2>角色:</h2>
              <span>{{info.role}}</span>
            </div>
            <div class="line">
              <h2>用户邮箱:</h2>
              <span>{{info.email}}</span>
            </div>
            <div class="line">
              <h2>手机号码:</h2>
              <span>{{info.phoneNumber}}</span>
            </div>
          </div>
        </el-aside>
        <el-container>
          <!-- 右侧 岗位信息 区域 -->
          <el-main width="47%">
            <div class="post_info">
              <h1 class="el-icon-monitor">岗位详细信息</h1>
              <div class="line">
                <h2>工号：</h2>
                <span>{{info.jobNum}}</span>
              </div>
              <div class="line">
                <h2>职务：</h2>
                <span>{{info.position}}</span>
              </div>
              <div class="line">
                <h2>部门：</h2>
                <span>{{info.department}}</span>
              </div>
              <div class="line">
                <h2>办公电话：</h2>
                <span>{{info.officePhone}}</span>
              </div>
              <div class="line">
                <h2>权限级别：</h2>
                <span>{{info.permissionLevel}}</span>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>

    <!-- 修改密码弹框 -->
    <!-- 这是点击修改密码的对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="changePasswordDialogVisible"
      width="30%"
      :before-close="changeHandleClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="changePasswordForm"
        :rules="changePasswordFormRules"
        ref="changePasswordFormRef"
        label-width="100px"
      >
        <!-- 原密码 -->
        <el-form-item label="原密码" prop="originalPassword">
          <el-input v-model="changePasswordForm.originalPassword" placeholder="请输入原来的登录密码"></el-input>
        </el-form-item>
        <!-- 新密码 -->
        <el-form-item label="新的密码" prop="newPassword">
          <el-input v-model="changePasswordForm.newPassword" placeholder="请设置新的登录密码"></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="affirmPassword">
          <el-input v-model="changePasswordForm.affirmPassword" placeholder="确认新的登录密码"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="changepasswordDialogVisible ">取 消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改信息弹框 -->
    <!-- 这是点击修改信息的对话框 -->
    <el-dialog
      title="修改信息"
      :visible.sync="changeInfoDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="changeInfoForm"
        :rules="changeInfoFormRules"
        ref="changeInfoFormRef"
        label-width="100px"
        :append-to-body="true"
      >
        <!-- 新用户名 -->
        <el-form-item label="新用户名" prop="username">
          <el-input v-model="changeInfoForm.username" placeholder="需要修改用户名，请输入"></el-input>
        </el-form-item>
        <!-- 新用户邮箱 -->
        <el-form-item label="新用户邮箱" prop="email">
          <el-input v-model="changeInfoForm.email" placeholder="需要修改邮箱，请输入"></el-input>
        </el-form-item>
        <!-- 新手机号码 -->
        <el-form-item label="新手机号码" prop="phoneNumber">
          <el-input v-model="changeInfoForm.phoneNumber" placeholder="需要修改手机号码，请输入"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelChangeinfoDialogVisible">取 消</el-button>
        <el-button type="primary" @click="changeInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "personal_center",
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/;
      if (!value) {
        callback();
      } else {
        if (regEmail.test(value)) {
          // 正确邮箱
          callback();
        } else {
          callback(new Error("请输入正确的邮箱"));
        }
      }
    };
    // 验证手机号的规则
    var checkPhoneNumber = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regPhoneNumber = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
      if (!value) {
        callback();
      } else {
        // console.log("jiance")
        if (regPhoneNumber.test(value)) {
          // 正确手机号
          callback();
        } else {
          callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      // 个人、岗位基本信息表单数据
      info: [],
      // 控制修改密码对话框的显示与隐藏
      changePasswordDialogVisible: false,
      // 修改密码的表单数据
      changePasswordForm: {
        // 点击修改按钮后 在sessionStorage获取当前登录用户的_id数据
        _id: "", //当前登录的id
        originalPassword: "", //原密码
        newPassword: "", //新的密码
        affirmPassword: ""
      },
      // 修改密码表单的验证规则对象
      changePasswordFormRules: {
        originalPassword: [
          {
            required: true,
            message: "旧密码不能为空！",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            max: 8,
            message: "密码长度在6~8个字符之间",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            trigger: "blur",
            message: "新密码不能为空"
          },
          {
            type: "string",
            min: 6,
            max: 8,
            message: "密码长度在6~8个字符之间",
            trigger: "blur"
          }
        ],
        affirmPassword: [
          {
            required: true,
            trigger: "blur",
            message: "确认密码不能为空"
          },
          {
            type: "string",
            min: 6,
            max: 8,
            message: "密码长度在6~8个字符之间",
            trigger: "blur"
          },
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value == "") {
                return callback(new Error("确认密码不能为空！"));
              } else if (value !== this.changePasswordForm.newPassword) {
                return callback(new Error("两次输入的密码不一致！"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      // 控制修改信息对话框的显示与隐藏
      changeInfoDialogVisible: false,
      // 修改信息的表单数据
      changeInfoForm: {
        // username: "656",
        // email: "sd@qq.com",
        // phoneNumber: "13827671156"
      },
      // 真正的修改订单信息表单，经过判断不为空的存进来
      // 点击修改按钮后 在sessionStorage获取当前登录用户的_id数据
      truechangeInfoForm: {
        // _id: "" // 当前登录的id
      },
      // 修改信息表单的验证规则对象
      changeInfoFormRules: {
        // 验证用户名是否合法
        username: [
          { message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 8,
            message: "用户名长度在 2 到 8 个字符",
            trigger: "blur"
          }
        ],
        email: [
          {
            min: 6,
            max: 20,
            message: "邮箱的长度在6~20个字符之间",
            trigger: "blur"
          },
          { validator: checkEmail, trigger: "change" }
        ],
        phoneNumber: [
          {
            min: 11,
            max: 11,
            message: "请输入11位数的手机号码",
            trigger: "blur"
          },
          { validator: checkPhoneNumber, trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    // 获取 个人基本信息、岗位信息 数据
    getInfo() {
      var id = sessionStorage.getItem("id");
      // console.log(id)
      this.$http.get("info", { params: { id: id } }).then(res => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          return this.$message.error("获取信息列表失败！");
        } else {
          this.info = res.data.infos;
        }
      });
    },

    // 监听修改密码按钮
    changepassworde() {
      this.changePasswordDialogVisible = true;
      // // 点击修改按钮后 在sessionStorage获取当前登录用户的_id数据，
      // // 并将其保存到 changePasswordForm中
      var id = sessionStorage.getItem("id");
      this.changePasswordForm._id = id;
    },
    // 监听关闭弹框事件
    changeHandleClose() {
      this.changePasswordDialogVisible = false;
      this.$refs.changePasswordFormRef.clearValidate(); //清空验证规则
      this.$refs.changePasswordFormRef.resetFields(); //清空表单数据
    },
    // 监听修改密码对话框 取消按钮，实现关闭和重置表单
    changepasswordDialogVisible() {
      this.changeHandleClose();
    },
    // 监听修改密码对话框的确定按钮
    changePassword(changePasswordForm) {
      this.$refs.changePasswordFormRef.validate(valid => {
        if (!valid) return;
        // 判断输入框为空的时候点击确定修改密码提示
        if (
          this.changePasswordForm.originalPassword == "" ||
          this.changePasswordForm.newPassword == "" ||
          this.changePasswordForm.affirmPassword == ""
        ) {
          this.$message.error("输入框内容不能为空！");
        } else {
          // 表单changePasswordForm携带数据，在服务器拿到数据会自动验证
          this.$http
            .post("changePassword", this.changePasswordForm)
            .then(res => {
              // console.log(res);
              if (res.data.meta.status == 400) {
                this.$message.error("原密码错误！");
              }
              if (res.data.meta.status == 300) {
                this.$message.error(" 新密码和原来密码一样！");
              }
              if (res.data.meta.status == 200) {
                this.$message.success("密码修改成功！");
                this.getInfo();
                this.changeHandleClose();
                var username = sessionStorage.getItem("username");//当前修改的用户
                var originalPassword = res.data.data.originalPassword; //原密码
                var newPassword = res.data.data.newPassword; //新密码
                return this.$notify.success({
                  title: "修改成功！",
                  message:
                    "成功修改用户" +
                    username +
                    " 的密码，" +
                    "由" +
                    originalPassword +
                    "修改为" +
                    newPassword
                });
              }
            });
        }
      });
    },

    // 监听修改信息按钮 点击打开
    changeinfo() {
      this.changeInfoDialogVisible = true;
    },
    // 监听修改信息对话框 取消按钮，实现关闭和重置表单
    cancelChangeinfoDialogVisible() {
      this.handleClose();
    },
    // 监听关闭对话框
    handleClose() {
      this.changeInfoDialogVisible = false;
      this.$refs.changeInfoFormRef.clearValidate(); //清空验证规则
      this.$refs.changeInfoFormRef.resetFields(); //清空表单数据
    },
    // 监听修改信息确定按钮
    changeInfo() {
      this.$refs.changeInfoFormRef.validate(valid => {
        if (!valid) return;
        // 判断输入框为空的时候点击确定修改信息提示
        if (
          this.changeInfoForm.username == undefined &&
          this.changeInfoForm.email == undefined &&
          this.changeInfoForm.phoneNumber == undefined
        ) {
          this.$message.error("输入框内容不能为空！");
        } else {
          // 判断输入框是否为空，不是则赋值到 truechangeInfoForm 表单中
          if (this.changeInfoForm.username != "") {
            this.truechangeInfoForm.username = this.changeInfoForm.username;
          }
          if (this.changeInfoForm.email != "") {
            this.truechangeInfoForm.email = this.changeInfoForm.email;
          }
          if (this.changeInfoForm.phoneNumber != "") {
            this.truechangeInfoForm.phoneNumber = this.changeInfoForm.phoneNumber;
          }
          // 从 sessionStorage 获取当前登录的用户的id
          var id = sessionStorage.getItem("id");
          // console.log(id);
          // 发送不为空的表单数据
          this.$http
            .post("changeInfo", {
              params: { Form: this.truechangeInfoForm, id: id }
            })
            .then(res => {
              console.log(res);
              if (res.data.meta.status == 440) {
                return this.$message.error("用户名已存在！");
              }
              if (res.data.meta.status == 400) {
                return this.$message.error("修改信息失败！");
              }

              if (res.data.meta.status == 200) {
                // 获取修改后的用户列表
                this.getInfo();
                this.changeInfoDialogVisible = false;
                this.changeInfoForm = {};
                if (this.changeInfoForm.username != "") {
                  location.reload(); //刷新页面  更新头部的用户名
                }
                this.$notify.success({
                  title: "修改成功",
                  message: "成功修改的信息"
                });
              }
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
// 面包屑导航区域,在全局样式（global.css）里面统一设定

.el-header {
  margin-top: 15px;
  margin-left: -20px;
}
// 左侧  头像 区域
.el-aside {
  margin-right: 4%; //左右距离
  //左侧上部 头像区域
  .aside_top {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    .change_msg {
      margin-top: 10px;
      span {
        font-size: 14px;
      }
    }
  }
  // 鼠标移动到变色/选择器
  .change_msg :hover {
    color: #409eff;
    cursor: pointer;
  }
}
// 左右信息模块的标题h1和h2以及span样式
.personal_info,
.post_info {
  display: flex;
  flex-direction: column;
  padding: 20px;
  // 信息标题
  h1 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 5px;
  }
}
// 信息内容
.line {
  display: flex;
  justify-content: start;
  align-items: center;
  background-color: #fff;
  margin: 10px;
  border-radius: 50px;
  h2 {
    font-size: 25px;
    font-weight: 400;
    margin: 20px;
  }
  span {
    font-size: 20px;
  }
}
// 修改密码对话框
</style>