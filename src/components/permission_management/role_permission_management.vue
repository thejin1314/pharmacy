<template>
  <div class="role_list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home_page' }">
        <i class="el-icon-s-home">首页</i>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span class="el-icon-lock">权限管理</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span class="el-icon-document">角色列表</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色 -->
      <div class="addRole_but">
        <el-tooltip effect="dark" content="获取全部角色列表" placement="top" :enterable="false">
          <el-button @click="refresh" type="primary">刷新</el-button>
        </el-tooltip>
      </div>

      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand"></el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" width="60px"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <el-table-column label="拥有者" prop="owner">
          <template slot-scope="scope">
            <!-- {{scope.row.}} -->
            <el-tag
              type="success"
              closable
              v-for="(item,index) in scope.row.owner"
              :key="index"
              :disable-transitions="false"
              @close="HandleClose(scope.row._id,item)"
            >{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="职务（权限）" prop="position"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- {{scope.row.role}} -->
            <el-tooltip effect="dark" content="修改拥有者" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="editPositionDialog(scope.row._id,scope.row.role)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="添加角色新的拥有者" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-circle-plus-outline"
                @click="addRoleOwnerDialog(scope.row._id,scope.row.role,scope.row.owner)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <h1>说明</h1>
        <li>该页面主要用来授权管理员的权限</li>
        <li>000001号管理员拥有绝对权限，无需授权即可登录</li>
        <li>拥有者栏的拥有者，表示已授权对应的角色权限以及职务，可登录</li>
        <li>拥有者栏未出现的拥有者，表示未授权对应的角色权限以及职务，即使在已注册也无法登录</li>
      </div>
    </el-card>

    <!-- 这是修改职务的对话框 -->
    <el-dialog
      title="修改职务"
      :visible.sync="editPositionDialogVisible"
      width="30%"
      :before-close="editHandleClose"
    >
      <el-form
        :model="editPositionForm"
        :rules="editPositionFormRules"
        ref="editPositionFormRef"
        label-width="100px"
      >
        <!-- 职务 -->
        <el-form-item label="职务（权限）" prop="position">
          <el-input type="textarea" :rows="3" v-model="editPositionForm.position"></el-input>
        </el-form-item>
        <!-- 底部区域 -->
        <el-form-item>
          <el-button @click="cancelEditPositionDialogVisible">取 消</el-button>
          <el-button type="primary" @click="editPosition">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 这是添加角色拥有者的对话框 -->
    <el-dialog
      title="添加角色新的拥有者"
      :visible.sync="addRoleOwnerDialogVisible"
      width="30%"
      :before-close="addHandleClose"
    >
      <el-form
        :model="addRoleOwnerForm"
        :rules="addRoleOwnerFormRules"
        ref="addRoleOwnerFormRef"
        label-width="100px"
      >
        <!-- 拥有者 -->
        <el-form-item label="拥有者" prop="owner">
          <!-- 选择器 -->
          <el-select v-model="addRoleOwnerForm.owner" clearable placeholder="请选择要添加角色新拥有者">
            <el-option
              v-for="item in owner"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 底部区域 -->
        <el-form-item>
          <el-button @click="canceladdRoleOwnerDialogVisible">取 消</el-button>
          <el-button type="primary" @click="addRoleOwner">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色权限管理列表
      roleList: [],
      refreshList: "",
      // 控制修改角色职务的对话框的显示与隐藏，默认隐藏
      editPositionDialogVisible: false,
      editPositionForm: {
        id: "",
        position: ""
      },
      // 修改规则
      editPositionFormRules: {
        position: [
          { required: true, message: "内容不能为空", trigger: "blur" },
          {
            required: true,
            min: 3,
            max: 30,
            message: "职务的长度在2~4个字符之间",
            trigger: "change"
          }
        ]
      },
      deleteOwnerForm: {
        _id: "",
        item: ""
      },
      // 控制添加角色拥有者的对话框的显示与隐藏，默认隐藏
      addRoleOwnerDialogVisible: false,
      // 选择角色拥有者
      owner: [
        // {
        //   label: "",
        //   value: ""
        // }
      ],
      // value: "",
      // 添加规则
      addRoleOwnerFormRules: {
        owner: [{ required: true, message: "请选择拥有者", trigger: "blur" }]
      },
      addRoleOwnerForm: {
        _id: "",
        role: "",
        owner: "", //新拥有者表单（选择器选择的内容
        owners: []
      }
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    getRolesList() {
      this.$http.get("roles").then(res => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          return this.$message.error("获取角色权限管理列表失败！");
        }
        this.roleList = res.data.data.roles;
        this.refreshList = res.data.meta.status;
      });
    },

    // 监听刷新按钮，实现获取全部药品列表和重置搜索表单
    refresh() {
      this.getRolesList();
      if ((this.refreshList = 200)) {
        this.$message.success("刷新成功！");
      } else this.$message.error("刷新失败！");
    },
    // 修改
    editPositionDialog(_id, role) {
      this.editPositionDialogVisible = true;
      this.editPositionForm.id = _id;
      this.editPositionForm.role = role;
    },
    // 监听关闭 修改窗口事件
    editHandleClose() {
      this.editPositionDialogVisible = false;
      // this.editPositionForm.position = "";

      this.$refs.editPositionFormRef.clearValidate(); //清空验证规则
      this.$refs.editPositionFormRef.resetFields(); //清空表单数据
    },
    // 取消按钮
    cancelEditPositionDialogVisible() {
      // this.editPositionDialogVisible = false;
      this.editHandleClose();
    },
    // 确定修改
    editPosition() {
      this.$refs.editPositionFormRef.validate(async valid => {
        if (!valid) return;
        if (this.editPositionForm.position != "") {
          // 修改roles数据库的position，即当前页面
          this.$http
            .post("editRolesPosition", this.editPositionForm)
            .then(res => {
              // console.log(res);
              if (res.data.meta.status != 200) {
                return this.$message.error("同步修改到logins数据库失败！");
              } else {
                // 重新获取角色列表数据
                this.getRolesList();
                this.editPositionDialogVisible = false;
                this.editPositionForm = {};
                // 定义当前修改的管理员名 Role
                // console.log(this.editPositionForm.role)
                var Role = this.editPositionForm.role;
                return this.$notify.success({
                  title: "成功！",
                  message: "已成功修改" + Role + "的职务！"
                });
              }
            });
          // 修改logins数据库的position
          this.$http
            .post("editLoginsPosition", this.editPositionForm)
            .then(res => {
              // console.log(res);
              if (res.data.meta.status != 200) {
                return this.$message.error("修改管理员的职务失败！");
              } else {
                //  成功不做提示
                // return this.$notify.success({
                //   title: "成功！",
                //   message: "已成功修改管理员的职务！"
                // });
              }
            });
        } else {
          return this.$message.error("内容不能为空！");
        }
      });
    },
    // 删除拥有者
    HandleClose(_id, item) {
      // console.log(_id, item);
      //     //   // console.log(row.owner[0]);
      this.deleteOwnerForm._id = _id;
      this.deleteOwnerForm.item = item;
      this.deleteOwner();
    },

    async deleteOwner() {
      // console.log(this.ownerForm);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色拥有者, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
        // 捕获错误消息，点击取消就会显示cancel，而不是一堆乱码
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$notify.info({
          title: "已取消！",
          message: "已取消删除该拥有者！"
        });
      }
      this.$http.post("deleteOwner", this.deleteOwnerForm).then(res => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          return this.$message.error("删除角色拥有者失败！");
        } else {
          var owner = this.deleteOwnerForm.item
        // console.log(this.deleteOwnerForm.item);
          this.$notify.success({
            title: "删除成功",
            message: "已成功删除角色拥有者"+owner
          });
          // 重新获取角色列表数据
          this.getRolesList();
        }
      });
    },

    // 添加按钮  点击后触发获取选择器中内容
    addRoleOwnerDialog(_id, role, owner) {
      this.addRoleOwnerDialogVisible = true;
      this.addRoleOwnerForm._id = _id;
      this.addRoleOwnerForm.role = role;
      // 获取列表的拥有者内容，用来添加新拥有者的时候判断是否存在
      this.addRoleOwnerForm.owners = owner;
      // console.log(owner)
      // var role = role;
      // this.getOwnerNameSlect()
      this.$http
        .get("ownerSelect", {
          params: { role: this.addRoleOwnerForm.role }
        })
        .then(res => {
          // console.log(res);
          if (res.data.meta.status != 200) {
            return this.$message.error("获取角色拥有者失败！");
          } else {
            // console.log(res.data.data.owner);
            var array = res.data.data.owner;
            array.forEach(element => {
              // console.log(element);
              var obj = { value: "", label: "" };
              obj.value = element;
              obj.label = element;
              this.owner.push(obj);
            });
          }
        });
    },
    // 监听添加关闭 添加窗口事件
    addHandleClose() {
      this.addRoleOwnerDialogVisible = false;
      this.$refs.addRoleOwnerFormRef.clearValidate(); //清空验证规则
      this.$refs.addRoleOwnerFormRef.resetFields(); //清空表单数据
      // this.addRoleOwnerDialogVisible = false;
      this.owner = []; //清空选择器
      // this.addRoleOwnerForm.owner = "";
    },
    // 取消按钮
    canceladdRoleOwnerDialogVisible() {
      this.addHandleClose();
    },
    // 确定添加
    addRoleOwner() {
      this.$refs.addRoleOwnerFormRef.validate(async valid => {
        if (!valid) return;
        // 列表中存在的拥有者的数量
        var length = this.addRoleOwnerForm.owners.length;
        // 判断列表中存在的拥有者是否为空
        if (length == 0) {
          //为空不用判断是否相同 直接添加
          this.addOwner();
        } else {
          //新拥有者表单（选择器选择的内容
          var owner = this.addRoleOwnerForm.owner;
          // console.log(this.addRoleOwnerForm.owner);
          // // 列表中已有的拥有者列表，遍历查询判断
          var array = this.addRoleOwnerForm.owners;
          // console.log(this.addRoleOwnerForm.owners);
          // console.log(length)
          var a;
          for (var i = 0; i < array.length; i++) {
            // console.log(array[i])
            if (owner == array[i]) {
              a = true;
              break;
            }
          }
          // console.log(a);
          if (a == true) {
            this.$notify.error({
              title: "添加失败！",
              message: "无法添加已存在（授权）的拥有者！"
            });
          } else {
            this.addOwner();
          }
        }
      });
    },
    // 添加拥有者确定后触发的方法
    addOwner() {
      this.$http.post("addOwner", this.addRoleOwnerForm).then(res => {
        console.log(res);
        if (res.data.meta.status != 200) {
          this.$notify.error({
            title: "错误！",
            message: "添加新拥有者失败！"
          });
        } else {
          var owner = res.data.data.owner; //拥有者
          var role = res.data.data.role; //角色
          this.$notify.success({
            title: "添加成功！",
            message: "已授权 " + owner + " 使用" + role + "权限"
          });
          // 重新获取角色列表数据
          this.getRolesList();
          this.addRoleOwnerDialogVisible = false;
          this.owner = [];
          this.addRoleOwnerForm.owner = "";
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
// 面包屑导航区域,在全局样式（global.css）里面统一设定
// .operation {
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }

.addRole_but {
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
  margin-bottom: -10px;
}
</style>