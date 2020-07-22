<template>
  <div class="order_list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home_page' }">
        <i class="el-icon-s-home">首页</i>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span class="el-icon-truck">订单管理</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span class="el-icon-document-copy">订单列表</span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="13">
        <el-col :span="8">
          <el-input placeholder="请输入内容（订单编号、订单价格、是否付款、发货状态）" v-model="searchOrdersForm" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchOrders"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-tooltip effect="dark" content="获取全部订单列表" placement="top" :enterable="false">
            <el-button @click="refresh" type="primary">刷新</el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <!-- 内容 -->
      <el-table :data="ordersList" border height="680px" width="100%">
        <!-- 索引 -->
        <el-table-column type="index" :index="indexNum" width="60px"></el-table-column>
        <el-table-column prop="orderNumber" label="订单编号"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间"></el-table-column>
        <el-table-column label="订单价格">
          <template slot-scope="scope">{{scope.row.orderPrice}}￥</template>
        </el-table-column>
        <el-table-column prop="payment" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.payment === '是'">已付款</el-tag>
            <el-tag type="danger" v-else-if="scope.row.payment === '否'">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="shipments" label="发货状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.shipments === '已发货'">已发货</el-tag>
            <el-tag type="danger" v-else-if="scope.row.shipments === '未发货'">未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="notes" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editOrderDialog(scope.row._id,scope.row.orderNumber)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removOrderByIdDialog(scope.row._id)"
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

    <!-- 这是修改订单信息的对话框 -->
    <el-dialog
      title="修改订单信息"
      :visible.sync="editOrderDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :model="editOrderForm"
        :rules="editOrderFormRules"
        ref="editOrderFormRef"
        label-width="100px"
      >
        <!-- 订单价格 -->
        <el-form-item label="订单价格" prop="orderPrice">
          <el-input v-model="editOrderForm.orderPrice"></el-input>
        </el-form-item>
        <!-- 发货状态 选择器-->
        <el-form-item label="发货状态" prop="shipments">
          <el-select v-model="editOrderForm.shipments" clearable placeholder="请选择发货状态">
            <el-option
              v-for="item in shipments"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 底部区域 -->
        <el-form-item>
          <el-button @click="cancelEditOrderDialogVisible">取 消</el-button>
          <el-button type="primary" @click="editOrder">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证价格的规则
    var checkPrice = (rule, value, callback) => {
      // 验证价格 首位不能为0 保留后两位数的正则表达式
      const regPrice = /^([1-9]{1}\d*)(\.\d{2})$/;
      if (regPrice.test(value)) {
        // 正确价格
        return callback();
      } else {
        if (value == "") {
          return callback();
        } else {
          callback(new Error("请输入正确的价格,如10.00"));
        }
      }
    };
    return {
      // 搜索表单,string
      searchOrdersForm: "",
      // 订单列表数据
      ordersList: [],
      // 订单列表列表参数
      parameter: [
        { total: "" }, //总数
        { pageSize: "10" }, //当前每页显示多少条数据
        { pageNum: "1" } // 当前页码
      ],
      // 控制修改订单信息对话框的显示与隐藏
      editOrderDialogVisible: false,
      // 修改订单信息的表单数据
      editOrderForm: {
        orderPrice: "",
        shipments: ""
      },
      // 修改订单信息验证规则
      editOrderFormRules: {
        orderPrice: [
          {
            required: false,
            min: 4,
            message: "请输入正确的价格,如10.00",
            trigger: "change"
          },
          { required: false, validator: checkPrice, trigger: "change" }
        ],
        shipments: [
          // { required: false, message: "请选择发货状态", trigger: "change" }
        ]
      },
      // 选择发货状态
      shipments: [
        {
          value: "已发货",
          label: "已发货"
        },
        {
          value: "未发货",
          label: "未发货"
        }
      ],
      // 真正的修改订单信息表单，经过判断不为空的存进来
      // 点击修改按钮后 获取当前一行用户的_id数据
      trueEditOrderForm: {
        _id: ""
      }
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    //// 获取订单列表数据
    getOrdersList() {
      this.$http.get("orders", { params: this.parameter }).then(res => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          return this.$message.error("获取订单列表失败！");
        } else {
          // 订单列表数据
          this.ordersList = res.data.data.orders;
          // 订单列表参数
          this.parameter.total = res.data.data.total;
        }
      });
    },
    // 监听刷新按钮，实现获取全部药品列表和重置搜索表单
    refresh() {
      this.getOrdersList();
      this.$message.success("刷新成功！");
      this.searchOrdersForm = "";
    },
    // 分页区域
    // 监听 pageSize（当前每页显示多少条数据） 事件
    handleSizeChange(pageSize) {
      // console.log(`每页 ${pageSize} 条`);
      this.parameter[1].pageSize = pageSize;
      // 默认每次切换显示多少条数据的时候，页码总在第一页
      this.parameter[2].pageNum = 1;
      if (this.searchOrdersForm == "") {
        this.getOrdersList(); //  重新获取全部药品列表数据
      } else {
        this.searchOrders(); //  重新获取搜索出来的药品列表数据
      }
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(pageNum) {
      // console.log(`当前页: ${pageNum}`);
      this.parameter[2].pageNum = pageNum;
      if (this.searchOrdersForm == "") {
        this.getOrdersList(); //  重新获取全部药品列表数据
      } else {
        this.searchOrders(); //  重新获取搜索出来的药品列表数据
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
    searchOrders(searchOrdersForm) {
      if (this.searchOrdersForm == "") {
        this.$message.error("搜索内容不能为空！");
      } else {
        // console.log(this.searchOrdersForm)
        this.$http
          .get("searchOrders", {
            params: {
              searchOrdersForm: this.searchOrdersForm,
              parameter: this.parameter
            }
          })
          .then(res => {
            console.log(res);
            if (res.data.meta.status != 200) {
              this.$message.error("没有该内容，请更换关键词搜索！");
            } else {
              // 搜索后的数据
              this.ordersList = res.data.data.searchOrder;
              // this.ordersList = res.data.data.searchOrders;
              // 查询到的订单总数
              this.parameter.total = res.data.data.total;
            }
          });
      }
    },

    // 监听修改订单信息按钮
    editOrderDialog(_id, orderNumber) {
      // 打开对话框
      this.editOrderDialogVisible = true;
      // console.log(_id);
      // 将获取到的一行的id保存到 trueEditUserForm 表单中
      this.trueEditOrderForm._id = _id;
      // 将获取到的一行的订单编号保存到 trueEditUserForm 表单中
      this.trueEditOrderForm.orderNumber = orderNumber;
      // console.log(orderNumber);
    },
    // 监听 关闭 修改用户对话框
    handleClose() {
      this.editOrderDialogVisible = false;
      this.$refs.editOrderFormRef.clearValidate(); //清空验证规则
      this.$refs.editOrderFormRef.resetFields(); //清空表单数据
    },
    // 监听取消按钮，实现关闭和重置表单
    cancelEditOrderDialogVisible() {
      this.handleClose();
    },
    // 监听修改订单对话框的确定按钮
    editOrder() {
      // 判断修改内容是否全部为空
      if (
        this.editOrderForm.orderPrice == "" &&
        this.editOrderForm.shipments == ""
      ) {
        this.$message.error("修改内容不能都为空！");
      } else {
        this.$refs.editOrderFormRef.validate(async valid => {
          if (!valid) return;
          // 判断输入框是否为空，不是则赋值到 trueEditUserForm 表单中
          if (this.editOrderForm.orderPrice != "") {
            this.trueEditOrderForm.orderPrice = this.editOrderForm.orderPrice;
          }
          if (this.editOrderForm.shipments != "") {
            this.trueEditOrderForm.shipments = this.editOrderForm.shipments;
          }
          // 发送不为空的表单数据
          this.$http.post("editOrder", this.trueEditOrderForm).then(res => {
            // console.log(res);
            if (res.data.meta.status != 200) {
              this.$message.error("修改订单信息失败！");
            } else {
              // 获取修改后的用户列表
              this.getOrdersList();
              // this.editOrderDialogVisible = false;
              // this.editOrderForm = {};
              this.handleClose();
              // 定义当前修改的内容类别 orderNumber
              if (this.trueEditOrderForm.orderPrice)
                console.log(this.trueEditOrderForm.orderPrice);
              // var orderNumber = this.trueEditOrderForm.orderNumber;

              // 定义当前修改的订单编号 orderNumber
              // console.log(this.trueEditOrderForm.orderNumber);
              var orderNumber = this.trueEditOrderForm.orderNumber;
              return this.$notify.success({
                title: "成功！",
                message: "已成功修改订单编号为" + orderNumber + "的信息！"
              });
            }
          });
        });
      }
    },

    //// 监听删除用户按钮
    async removOrderByIdDialog(_id) {
      var id = _id;
      // 输出当前一行用户的id
      console.log(_id);
      // // 将获取到的一行的id保存到 trueRemoveDrugForm 表单中
      // this.trueRemoveDrugForm._id = _id;

      // 打开对话框提示是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该条订单信息, 是否继续?",
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
          message: "已取消删除该订单！"
        });
      }
      this.$http.post("deleteOrder", { params: { _id: id } }).then(res => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          this.$message.error("删除该订单失败！");
        } else {
          // 获取删除后的订单列表
          this.getOrdersList();
          return this.$notify.success({
            title: "成功！",
            message: "已成功删除该订单！"
          });
        }
      });
    },
    // 监听删除订单对话框
    cancelButtonText() {
      // 获取删除后的订单列表
      this.getOrdersList();
    }
  }
};
</script>

<style lang="less" scoped>
// 面包屑导航区域,在全局样式（global.css）里面统一设定

// .block{
//   height: 20px;
// }
</style>