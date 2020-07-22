<template>
  <div class="users_list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home_page' }">
        <i class="el-icon-s-home">首页</i>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span class="el-icon-user">用户管理</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span class="el-icon-document-remove">用户列表</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索、添加用户区域 -->
      <el-row :gutter="13">
        <el-col :span="8">
          <el-input placeholder="请输入内容（用户名、邮箱、手机号码）" v-model="searchUsersForm" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3.9">
          <el-tooltip effect="dark" content="添加新用户" placement="top" :enterable="false">
            <el-button type="primary" @click="addUserDialogVisible=true">添加新用户</el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="3.9">
          <el-tooltip effect="dark" content="获取全部用户列表" placement="top" :enterable="false">
            <el-button @click="refresh" type="primary">刷新</el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <!-- 用户列表内容 -->
      <el-table :data="userlist" border stripe height="680px" width="100%">
        <!-- 索引 -->
        <el-table-column type="index" :index="indexNum" width="60px"></el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column label="角色" prop="role">
          <template slot-scope="scope">
            <el-tag>{{scope.row.role}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机号码" prop="phoneNumber"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 为按钮绑定mgState（Boolean类型）来判断开关 -->
            <!-- {{scope.row.mgState}} -->
            <el-switch v-model="scope.row.mgState" @change="mgStateDialog(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <!-- <template> -->
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUserDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removUserByIdDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="block">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="parameter.pageNum"
          :page-sizes="[5, 10, 20]"
          :page-size="parameter.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="parameter.total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 对话框 -->
    <!-- 这是点击添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="30%"
      :before-close="addHandleClose"
    >
      <!-- 内容主体区域  表单验证-->
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="100px"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addUserForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="passWord">
          <el-input v-model="addUserForm.passWord" placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <!-- 手机号码 -->
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="addUserForm.phoneNumber" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddUserDialogVisible">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 这是修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialogVisible"
      width="30%"
      :before-close="editHandleClose"
    >
      <el-form
        :model="editUserForm"
        :rules="editUserFormRules"
        ref="editUserFormRef"
        label-width="100px"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editUserForm.userName" placeholder="需要修改用户名，请输入"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email" placeholder="需要修改邮箱，请输入"></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="editUserForm.phoneNumber" placeholder="需要修改手机号码，请输入"></el-input>
        </el-form-item>
        <!-- 底部区域 -->
        <el-form-item>
          <el-button @click="cancelEditUserDialogVisible">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
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
      // 用户列表数据
      userlist: [],
      // 用户列表参数
      parameter: [
        { total: "" }, //总数
        { pageSize: "10" }, //当前每页显示多少条数据
        { pageNum: "1" } // 当前页码
      ],
      // 控制添加用户对话框的显示与隐藏
      addUserDialogVisible: false,
      // 搜索表单,string
      searchUsersForm: "",
      // 添加用户的表单数据
      addUserForm: {
        userName: "",
        passWord: "",
        role: "",
        email: "",
        phoneNumber: ""
      },
      // // 状态及其id表单
      // trueMgStateForm: {
      //   _id: "",
      //   mgState:""
      // },
      // 修改用户的表单数据
      editUserForm: {
        userName: "",
        email: "",
        phoneNumber: ""
      },
      // 真正的修改用户信息表单，经过判断不为空的存进来
      // 点击修改按钮后 获取当前一行用户的_id数据
      trueEditUserForm: {
        _id: ""
      },
      // 删除用户的表单数据id
      trueRemoveUserForm: {
        _id: ""
      },

      // 添加表单的验证规则对象,适用所有
      addUserFormRules: {
        // 用户名
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 8,
            message: "用户名的长度在 2~8 个字符",
            trigger: "blur"
          }
        ],
        // 密码
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            type: "string",
            min: 6,
            max: 8,
            message: "密码长度在6~8个字符之间",
            trigger: "blur"
          }
        ],
        // 邮箱
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "邮箱的长度在6~20个字符之间",
            trigger: "blur"
          },
          { validator: checkEmail, trigger: "change" }
        ],
        // 手机号码
        phoneNumber: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "请输入11位数的手机号码",
            trigger: "blur"
          },
          { validator: checkPhoneNumber, trigger: "change" }
        ]
      },
      // 修改用户表单的验证规则
      editUserFormRules: {
        // 用户名
        userName: [
          {
            min: 2,
            max: 4,
            message: "用户名的长度在2~4个字符之间",
            trigger: "blur"
          }
        ],
        // 邮箱
        email: [
          {
            min: 6,
            max: 20,
            message: "邮箱的长度在6~20个字符之间",
            trigger: "blur"
          },
          { validator: checkEmail, trigger: "change" }
        ],
        // 手机号码
        phoneNumber: [
          {
            min: 11,
            max: 11,
            message: "手机号码的长度在11个字符",
            trigger: "blur"
          },
          { validator: checkPhoneNumber, trigger: "change" }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editUserDialogVisible: false
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表数据
    getUserList() {
      this.$http.get("users", { params: this.parameter }).then(res => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          return this.$message.error("获取角色列表失败！");
        } else {
          // 用户列表数据
          this.userlist = res.data.data.users;
          // 用户列表参数
          this.parameter.total = res.data.data.total;
        }
      });
    },
    // 监听刷新按钮，实现获取全部药品列表和重置搜索表单
    refresh() {
      this.getUserList();
      this.$message.success("刷新成功！");
      this.searchUsersForm = "";
    },
    // 分页区域
    // 监听 pageSize（当前每页显示多少条数据） 事件
    handleSizeChange(pageSize) {
      // console.log(`每页 ${pageSize} 条`);
      this.parameter[1].pageSize = pageSize;
      // 默认每次切换显示多少条数据的时候，页码总在第一页
      this.parameter[2].pageNum = 1;
      if (this.searchUsersForm == "") {
        this.getUserList(); //  重新获取全部药品列表数据
      } else {
        this.searchUsers(); //  重新获取搜索出来的药品列表数据
      }
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(pageNum) {
      // console.log(`当前页: ${pageNum}`);
      this.parameter[2].pageNum = pageNum;
      if (this.searchUsersForm == "") {
        this.getUserList(); //  重新获取全部药品列表数据
      } else {
        this.searchUsers(); //  重新获取搜索出来的药品列表数据
      }
    },
    // 索引
    indexNum(index) {
      // 当前每页显示多少条数据
      var pageSize = this.parameter[1].pageSize;
      // 页码
      var pageNum = this.parameter[2].pageNum;
      return (pageNum - 1) * pageSize + index + 1;
    },

    // // 搜索
    searchUsers(searchUsersForm) {
      if (this.searchUsersForm == "") {
        this.$message.error("搜索内容不能为空！");
      } else {
        // console.log(this.searchUsersForm)
        this.$http
          .get("searchUsers", {
            params: {
              searchUsersForm: this.searchUsersForm,
              parameter: this.parameter
            }
          })
          .then(res => {
            // console.log(res)
            if (res.data.meta.status != 200) {
              this.$message.error("没有该内容，请更换关键词搜索！");
            } else {
              // 搜索后的数据
              this.userlist = res.data.data.searchUser;
              // this.userlist = res.data.data.searchUsers;
              // 查询到的用户总数
              this.parameter.total = res.data.data.total;
            }
          });
      }
    },

    // 监听 关闭 添加用户对话框
    addHandleClose() {
      this.addUserDialogVisible = false;
      this.$refs.addUserFormRef.clearValidate(); //清空验证规则
      this.$refs.addUserFormRef.resetFields(); //清空表单数据
    },
    // 监听添加用户对话框 取消按钮，实现关闭和重置表单
    cancelAddUserDialogVisible() {
      this.addHandleClose();
    },
    // 确定按钮
    addUser() {
      this.$refs.addUserFormRef.validate(valid => {
        if (!valid) return;
        // 表单addUserForm携带数据，在服务器拿到数据会自动验证
        this.$http.post("addUser", this.addUserForm).then(res => {
          // console.log(res);
          if (res.data.meta.status != 200) {
            this.$notify.error({
              title: "错误",
              message: "用户名已存在！"
            });
          } else {
            // 获取添加用户后的用户列表
            this.getUserList();
            this.addHandleClose();
            var userName = res.data.data.addUserInsert.userName; //新用户
            this.$notify.success({
              title: "添加成功！",
              message: "已成功添加新用户" + userName
            });
          }
        });
      });
    },

    //// 监听状态
    mgStateDialog(userinfo) {
      // console.log(userinfo._id)
      // console.log(userinfo.mgState)
      // console.log(typeof(userinfo.mgState))
      //   // 将获取到的一行的_id和mgState保存到 trueMgStateForm 表单中
      var id = userinfo._id;
      var mgState = userinfo.mgState;
      this.$http.post("userState", { id: id, mgState: mgState }).then(res => {
        // console.log(res)
        var userName = res.data.data.userStateUpdata.userName;
        var mgState = res.data.data.userStateUpdata.mgState;
        if (res.data.meta.status != 200) {
          this.$message.error("状态修改失败！");
          return this.$notify.error({
            title: "错误！",
            message: "修改用户" + userName + "的状态失败"
          });
        } else {
          // 获取修改后的用户列表
          this.getUserList();
          if (mgState == true) {
            return this.$notify.success({
              title: "状态开启成功！",
              message: "已成功开启用户" + userName + "的状态"
            });
          } else {
            return this.$notify.success({
              title: "状态关闭成功！",
              message: "已成功关闭用户" + userName + "的状态"
            });
          }
        }
      });
    },

    //// 监听修改用户按钮
    editUserDialog(_id) {
      // 打开对话框
      // console.log(_id)
      this.editUserDialogVisible = true;
      // console.log(_id);
      // // 将获取到的一行的id保存到 trueEditUserForm 表单中
      this.trueEditUserForm._id = _id;
    },
    // 监听 关闭 对话框
    editHandleClose() {
      this.editUserDialogVisible = false;
      this.$refs.editUserFormRef.clearValidate(); //清空验证规则
      this.$refs.editUserFormRef.resetFields(); //清空表单数据
    },
    // 监听修改用户对话框 取消按钮，实现关闭和重置表单
    cancelEditUserDialogVisible() {
      this.editHandleClose();
    },
    // 监听修改用户对话框的确定按钮
    editUser() {
      // 判断全部表单是否为空
      var a; //定义a true时不全部为空、undefined全空
      var editUserForm = this.editUserForm;
      Object.keys(editUserForm).forEach(element => {
        // console.log(editUserForm[element]);
        if (editUserForm[element] != "") {
          a = true;
        }
      });
      // console.log(a);
      if (a != true) {
        this.$message.error("修改内容不能为空！");
      } else {
        this.$refs.editUserFormRef.validate(valid => {
          if (!valid) return;
          // 判断三个输入框是否为空，不是则赋值到 trueEditUserForm 表单中
          if (this.editUserForm.userName != "") {
            this.trueEditUserForm.userName = this.editUserForm.userName;
          }
          if (this.editUserForm.email != "") {
            this.trueEditUserForm.email = this.editUserForm.email;
          }
          if (this.editUserForm.phoneNumber != "") {
            this.trueEditUserForm.phoneNumber = this.editUserForm.phoneNumber;
          }
          // 发送不为空的表单数据
          this.$http.post("editUser", this.trueEditUserForm).then(res => {
            console.log(res);
            if (res.data.meta.status != 200) {
              this.$message.error("修改用户信息失败！");
            } else {
              // 获取修改后的用户列表
              this.getUserList();
              this.editHandleClose();
              // this.editUserDialogVisible = false;
              // this.editUserForm = {};
              return this.$notify.success({
                title: "修改成功！",
                message: "已成功修改用户信息！"
              });
            }
          });
        });
      }
    },

    //// 监听删除用户按钮
    async removUserByIdDialog(_id) {
      // 输出当前一行用户的id
      // console.log(_id);
      // // 将获取到的一行的id保存到 trueRemoveUserForm 表单中
      this.trueRemoveUserForm._id = _id;
      // 打开对话框提示是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
        // 捕获错误消息，点击取消就会显示cancel，而不是一堆乱码
      ).catch(err => err);
      // 点击确定就会显示confirm，点击取消就会显示cancel
      // console.log(confirmResult);

      // 判断是否是 confirm不是就返回 取消 消息框，
      // 是就向服务器发送，并返回 确认 消息框
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除该用户！");
      }
      this.$http.post("deleteUser", this.trueRemoveUserForm).then(res => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          this.$message.error("删除该用户失败！");
        } else {
          // 获取删除后的用户列表
          this.getUserList();
          return this.$notify.success({
            title: "成功！",
            message: "已成功删除该用户成功！！"
          });
        }
      });
    },
    // 监听删除用户对话框
    cancelButtonText() {
      // 获取删除后的用户列表
      this.getUserList();
    }
  }
};
</script>

<style lang="less" scoped>
// 面包屑导航区域,在全局样式（global.css）里面统一设定
</style>