<template>
  <div class="admin_list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home_page' }">
        <i class="el-icon-s-home">首页</i>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span class="el-icon-user">用户管理</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span class="el-icon-s-custom">管理员列表</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索、添加管理员区域 -->
      <el-row :gutter="13">
        <el-col :span="8">
          <el-input placeholder="请输入内容（用户名、角色、工号、部门）" v-model="searchAdminsForm" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchAdmins"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3.9">
          <el-tooltip effect="dark" content="添加新管理员" placement="top" :enterable="false">
            <el-button type="primary" @click="addAdminDialog">添加新管理员</el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="3.9">
          <el-tooltip effect="dark" content="获取全部用户列表" placement="top" :enterable="false">
            <el-button @click="refresh" type="primary">刷新</el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <!-- 管理员列表内容 -->
      <el-table :data="adminList" border stripe height="680px" width="100%">
        <!-- 索引 -->
        <el-table-column type="index" :index="indexNum" width="60px"></el-table-column>
        <el-table-column label="用户名" prop="username" width="90px"></el-table-column>
        <el-table-column label="密码" prop="password" width="100px"></el-table-column>
        <el-table-column label="角色" prop="role">
          <!-- <template slot-scope="scope">
            <el-tag v-if="scope.row.role === '管理员'">管理员</el-tag>
            <el-tag type="info" v-else-if="scope.row.role === '普通用户'">普通用户</el-tag>
          </template>-->
        </el-table-column>
        <el-table-column label="邮箱" prop="email" width="170px"></el-table-column>
        <el-table-column label="手机号码" prop="phoneNumber" width="160px"></el-table-column>
        <el-table-column label="工号" prop="jobNum"></el-table-column>
        <el-table-column label="职务" prop="position"></el-table-column>
        <el-table-column label="部门" prop="department"></el-table-column>
        <el-table-column label="办公电话" prop="officePhone"></el-table-column>
        <el-table-column label="权限级别" prop="permissionLevel">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.permissionLevel === '一级'">一级权限</el-tag>
            <el-tag type="success" v-else-if="scope.row.permissionLevel === '二级'">二级权限</el-tag>
            <el-tag type="info" v-else-if="scope.row.permissionLevel === '三级'">三级权限</el-tag>
            <el-tag type="danger" v-else-if="scope.row.permissionLevel === '四级'">四级权限</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <template> -->
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editAdminDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAdminByIdDialog(scope.row._id)"
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
    <!-- 这是点击添加管理员的对话框 -->
    <el-dialog
      title="添加新管理员"
      :visible.sync="addAdminDialogVisible"
      width="50%"
      :before-close="addHandleClose"
    >
      <!-- 内容主体区域  表单验证-->
      <el-form
        :model="addAdminForm"
        :rules="addAdminFormRules"
        ref="addAdminFormRef"
        label-width="100px"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="addAdminForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="addAdminForm.password"></el-input>
        </el-form-item>
        <!-- 角色 -->
        <el-form-item label="角色" prop="role">
          <!-- 选择器 -->
          <el-select v-model="addAdminForm.role" clearable placeholder="请选择角色">
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="addAdminForm.email"></el-input>
        </el-form-item>
        <!-- 手机号码 -->
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input placeholder="请输入手机号码" v-model="addAdminForm.phoneNumber"></el-input>
        </el-form-item>
        <!-- 工号 -->
        <el-form-item label="工号" prop="jobNum">
          <el-input placeholder="请输入六位阿拉伯数字的工号" v-model="addAdminForm.jobNum"></el-input>
        </el-form-item>
        <!-- 办公电话 -->
        <el-form-item label="办公电话" prop="officePhone">
          <el-input placeholder="请输入办公电话" v-model="addAdminForm.officePhone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddAdminDialogVisible">取 消</el-button>
        <el-button type="primary" @click="addAdmin">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 这是修改 管理员 的对话框 -->
    <el-dialog
      title="修改管理员"
      :visible.sync="editAdminDialogVisible"
      width="30%"
      :before-close="editHandleClose"
    >
      <el-form
        :model="editAdminForm"
        :rules="editAdminFormRules"
        ref="editAdminFormRef"
        label-width="100px"
      >
        <!-- 用户名 -->
        <el-form-item label="工号" prop="jobNum">
          <el-input v-model="editAdminForm.jobNum" placeholder="需要修改工号，请输入"></el-input>
        </el-form-item>
        <!-- 底部区域 -->
        <el-form-item>
          <el-button @click="cancelEditAdminDialogVisible">取 消</el-button>
          <el-button type="primary" @click="editAdmin">确 定</el-button>
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
    // 验证工号
    var checkJobNum = (rule, value, callback) => {
      const regJobNum = /^[0-9]*$/;
      if (!value) {
        callback();
      } else {
        // console.log("jiance")
        if (regJobNum.test(value)) {
          // 正确手机号
          callback();
        } else {
          callback(new Error("请输入正确的工号"));
        }
      }
    };
    // 验证办公电话
    var checkOfficePhone = (rule, value, callback) => {
      const regOfficePhone = /^[0-9]*$/;
      if (!value) {
        callback();
      } else {
        // console.log("jiance")
        if (regOfficePhone.test(value)) {
          // 正确手机号
          callback();
        } else {
          callback(new Error("请输入正确的办公电话"));
        }
      }
    };
    // 验证是否选择角色
    var checkRole = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入正确的办公电话"));
      } else {
        // 正确手机号
        callback();
      }
    };

    return {
      // 管理员列表数据
      adminList: [],
      // 管理员列表参数
      parameter: [
        { total: "" }, //总数
        { pageSize: "10" }, //当前每页显示多少条数据
        { pageNum: "1" } // 当前页码
      ],
      // 控制添加管理员对话框的显示与隐藏
      addAdminDialogVisible: false,
      // 选择角色
      roles: [
        {
          value: "系统管理员",
          label: "系统管理员"
        },
        {
          value: "药品管理员",
          label: "药品管理员"
        },
        {
          value: "订单管理员",
          label: "订单管理员"
        },
        {
          value: "用户管理员",
          label: "用户管理员"
        }
      ],
      value: "", //不选择时的默认值
      // 搜索表单,string
      searchAdminsForm: "",
      // 添加管理员的表单数据
      addAdminForm: {
        username: "",
        password: "",
        role: "",
        email: "",
        phoneNumber: "",
        jobNum: "",
        position: "",
        department: "",
        officePhone: "",
        permissionLevel: ""
      },
      // 点击添加新管理员获取到的对应的管理员的职务表单
      positionForm: {},
      // 添加表单的验证规则对象
      addAdminFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 8,
            message: "用户名长度在 2~8 个字符",
            trigger: "blur"
          }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 8,
            message: "密码长度在 6~8 个字符",
            trigger: "blur"
          }
        ],
        // 角色
        role: [{ validator: checkRole, trigger: "blur" }],
        // 邮箱
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "邮箱的长度在 6~20 个字符",
            trigger: "blur"
          },
          { validator: checkEmail, trigger: "blur" }
        ],
        // 手机号码
        phoneNumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "请输入11位数的手机号码",
            trigger: "blur"
          },
          { validator: checkPhoneNumber, trigger: "blur" }
        ],
        // 验证工号是否合法
        jobNum: [
          { required: true, message: "工号不能为空", trigger: "blur" },
          {
            min: 6,
            max: 6,
            message: "工号长度在 6 个字符",
            trigger: "blur"
          },
          { validator: checkJobNum, trigger: "blur" }
        ],

        // 验证办公电话是否合法
        officePhone: [
          { required: true, message: "办公电话不能为空", trigger: "blur" },
          {
            min: 7,
            max: 13,
            message: "办公电话长度在 7~13 个字符",
            trigger: "blur"
          },
          { validator: checkOfficePhone, trigger: "blur" }
        ]
      },

      // 修改管理员的对话框表单数据
      editAdminForm: {
        jobNum: "",
        _id: ""
      },
      // 修改表单的验证规则对象
      editAdminFormRules: {
        // 验证工号是否合法
        jobNum: [
          { message: "工号不能为空", trigger: "blur" },
          {
            min: 6,
            max: 6,
            message: "工号长度在 6 个字符",
            trigger: "blur"
          },
          { validator: checkJobNum, trigger: "blur" }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editAdminDialogVisible: false
    };
  },
  created() {
    this.getAdminList();
  },
  methods: {
    // 获取管理员列表数据
    getAdminList() {
      this.$http.get("admins", { params: this.parameter }).then(res => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          return this.$message.error("获取管理员列表失败！");
        } else {
          // 管理员列表数据
          this.adminList = res.data.data.admins;
          // 管理员列表参数
          this.parameter.total = res.data.data.total;
        }
      });
    },

    // 监听刷新按钮，实现获取管理员列表和重置搜索表单
    refresh() {
      this.getAdminList();
      this.$message.success("刷新成功！");
      this.searchAdminsForm = "";
    },

    // 分页区域
    // 监听 pageSize（当前每页显示多少条数据） 事件
    handleSizeChange(pageSize) {
      // console.log(`每页 ${pageSize} 条`);
      this.parameter[1].pageSize = pageSize;
      // 默认每次切换显示多少条数据的时候，页码总在第一页
      this.parameter[2].pageNum = 1;
      if (this.searchAdminsForm == "") {
        this.getAdminList(); //  重新获取全部药品列表数据
      } else {
        this.searchAdmins(); //  重新获取搜索出来的药品列表数据
      }
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(pageNum) {
      // console.log(`当前页: ${pageNum}`);
      this.parameter[2].pageNum = pageNum;
      if (this.searchAdminsForm == "") {
        this.getAdminList(); //  重新获取全部药品列表数据
      } else {
        this.searchAdmins(); //  重新获取搜索出来的药品列表数据
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
    searchAdmins(searchAdminsForm) {
      if (this.searchAdminsForm == "") {
        this.$message.error("搜索内容不能为空！");
      } else {
        // console.log(this.searchAdminsForm)
        this.$http
          .get("searchAdmins", {
            params: {
              searchAdminsForm: this.searchAdminsForm,
              parameter: this.parameter
            }
          })
          .then(res => {
            // console.log(res);
            if (res.data.meta.status != 200) {
              this.$message.error("没有该内容，请更换关键词搜索！");
            } else {
              // 搜索后的数据
              this.adminList = res.data.data.searchAdmins;
              // 查询到的管理员总数
              this.parameter.total = res.data.data.total;
            }
          });
      }
    },

    //// 添加新管理员
    addAdminDialog() {
      this.addAdminDialogVisible = true;
      var system = "系统管理员";
      var drug = "药品管理员";
      var order = "订单管理员";
      var user = "用户管理员";
      // 获取管理员对应的职务
      this.$http
        .get("position", {
          params: { system: system, drug: drug, order: order, user: user }
        })
        .then(res => {
          // console.log(res.data.data);
          this.positionForm.systemPosition = res.data.data.systemPosition;
          this.positionForm.drugPosition = res.data.data.drugPosition;
          this.positionForm.orderPosition = res.data.data.orderPosition;
          this.positionForm.userPosition = res.data.data.userPosition;
        });
    },
    // 监听 关闭 添加管理员对话框
    addHandleClose() {
      this.addAdminDialogVisible = false;
      this.$refs.addAdminFormRef.clearValidate(); //清空验证规则
      this.$refs.addAdminFormRef.resetFields(); //清空表单数据
    },
    // 监听添加管理员对话框 取消按钮，实现关闭和重置表单
    cancelAddAdminDialogVisible() {
      this.addHandleClose();
    },
    // 确认按钮
    addAdmin() {
      this.$refs.addAdminFormRef.validate(valid => {
        if (!valid) return;
        if (this.addAdminForm.role == "系统管理员") {
          this.addAdminForm.position = this.positionForm.systemRoleDescribe;
          this.addAdminForm.department = "研发部门";
          this.addAdminForm.permissionLevel = "一级";
        }
        if (this.addAdminForm.role == "药品管理员") {
          this.addAdminForm.position = this.positionForm.drugRoleDescribe;
          this.addAdminForm.department = "市场部门";
          this.addAdminForm.permissionLevel = "二级";
        }
        if (this.addAdminForm.role == "订单管理员") {
          this.addAdminForm.position = this.positionForm.orderRoleDescribe;
          this.addAdminForm.department = "运营部门";
          this.addAdminForm.permissionLevel = "三级";
        }
        if (this.addAdminForm.role == "用户管理员") {
          this.addAdminForm.position = this.positionForm.userRoleDescribe;
          this.addAdminForm.department = "人事部门";
          this.addAdminForm.permissionLevel = "四级";
        }
        // 表单addAdminForm携带数据，在服务器拿到数据会自动验证
        this.$http.post("addAdmin", this.addAdminForm).then(res => {
          // console.log(res);
          if (res.data.meta.status == 200) {
            this.getAdminList();
            this.addAdminDialogVisible = false;
            this.addAdminForm = {};
            var username = res.data.data.addAdmin.username; //当前添加的用户
            return this.$notify.success({
              title: "添加成功！",
              message: "已成功添加新管理员" + username
            });
          } else {
            //数据库中含有相同的用户名或者工号 的具体数据arrayT
            var arrayT = res.data.data.tank;
            // console.log(arrayT)
            arrayT.forEach(element => {
              // console.log(element.username)
              // console.log(element.jobNum)
              var username = element.username;
              var email = element.email;
              var phoneNumber = element.phoneNumber;
              var jobNum = element.jobNum;
              // 输入的表单：用户名、邮箱、手机号码、工号
              // console.log(this.addAdminForm.email)
              // 匹配输入的表单和数据库的数据（后端返回的数据），判断是什么相同影响新建管理员，并提示
              if (this.addAdminForm.username == username) {
                this.$notify.error({
                  title: "错误",
                  message: "用户名已存在！"
                });
              }
              if (this.addAdminForm.email == email) {
                this.$message.error("邮箱已存在！");
                this.$notify.error({
                  title: "错误",
                  message: "用户名已存在！"
                });
              }
              if (this.addAdminForm.phoneNumber == phoneNumber) {
                this.$notify.error({
                  title: "错误",
                  message: "手机号码已存在！"
                });
              }
              if (this.addAdminForm.jobNum == jobNum) {
                this.$notify.error({
                  title: "错误",
                  message: "工号已存在！"
                });
              }
            });
          }
        });
      });
    },

    // //// 监听修改管理员按钮
    editAdminDialog(_id) {
      // 打开对话框
      // console.log(_id)
      this.editAdminDialogVisible = true;
      // console.log(_id);
      // // 将获取到的一行的id保存到 editAdminForm 表单中
      this.editAdminForm._id = _id;
    },
    // // 监听修改管理员对话框 取消按钮，实现关闭和重置表单
    cancelEditAdminDialogVisible() {
      this.editHandleClose();
    },
    // 监听修改关闭窗口事件
    editHandleClose() {
      this.editAdminDialogVisible = false;
      this.$refs.editAdminFormRef.clearValidate(); //清空验证规则
      this.$refs.editAdminFormRef.resetFields(); //清空表单数据
    },
    // 监听修改管理员对话框的确定按钮
    editAdmin() {
      // 判断输入框是否为空
      if (this.editAdminForm.jobNum == "") {
        this.$message.error("修改内容不能为空");
      } else {
        this.$http.post("editAdmin", this.editAdminForm).then(res => {
          // console.log(res);
          if (res.data.meta.status != 200) {
            this.$message.error("修改管理员工号失败！");
          } else {
            // 获取修改后的管理员列表
            this.getAdminList();
            this.editHandleClose();
            var username = res.data.data.username; //当前修改的用户
            var oldJobNum = res.data.data.oldJobNum; //原工号
            var newJobNum = res.data.data.newJobNum; //新工号
            return this.$notify.success({
              title: "修改成功！",
              message:
                "已成功修改用户" +
                username +
                " 的工号，由原来的" +
                oldJobNum +
                "修改为" +
                newJobNum
            });
          }
        });
      }
    },

    //// 监听删除管理员按钮
    async deleteAdminByIdDialog(_id) {
      // console.log(_id);
      var id = _id;
      // 打开对话框提示是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该管理员, 是否继续?",
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
        return this.$notify.info({
          title: "已取消！",
          message: "已取消删除该管理员！"
        });
      }
      this.$http.post("deleteAdmin", { params: { id: id } }).then(res => {
        console.log(res);
        if (res.data.meta.status != 200) {
          this.$message.error("删除该管理员失败！");
        } else {
          // 获取删除后的 管理员 列表
          this.getAdminList();
          return this.$notify.success({
            title: "成功！",
            message: "已成功删除该管理员！"
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
// 面包屑导航区域,在全局样式（global.css）里面统一设定
</style>