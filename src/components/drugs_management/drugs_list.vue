<template>
  <div class="drugs_list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home_page' }">
        <i class="el-icon-s-home">首页</i>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <i class="el-icon-first-aid-kit"></i>
        <span>药品管理</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span>
          <img src="../../assets/drugs_management/DrugsList.png" alt />药品列表
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索、添加药品区域 -->
      <el-row :gutter="13">
        <el-col :span="8">
          <el-input placeholder="请输入内容（药品名、价格、分类、作用）" clearable v-model="searchDrugsForm">
            <el-button slot="append" icon="el-icon-search" @click="searchDrugs"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3.9">
          <el-tooltip effect="dark" content="添加新药品" placement="top" :enterable="false">
            <el-button type="primary" @click="addDrugDialogVisible=true">添加新药品</el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="3.9">
          <el-tooltip effect="dark" content="获取全部药品列表" placement="top" :enterable="false">
            <el-button @click="refresh" type="primary">刷新</el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <!-- 内容 -->
      <el-table :data="drugsList" border height="680px" width="100%">
        <!-- 索引 -->
        <el-table-column type="index" :index="indexNum" width="60px"></el-table-column>
        <!-- <el-table-column prop="picture" label="图片" width="140px"> -->
          <!-- <template slot-scope="scope">
            <img class="drug_picture" :src="scope.row.picture" alt />
          </template>
        </el-table-column> -->
        <el-table-column prop="drugsName" label="药品名" width="200px"></el-table-column>
        <el-table-column prop="specification" label="规格" width="160px"></el-table-column>
        <el-table-column label="价格￥" width="140px">
          <template slot-scope="scope">{{scope.row.price}}￥</template>
        </el-table-column>
        <el-table-column prop="classify" label="分类" width="140px">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.classify === '感冒发烧'">
              <span>
                <img src="../../assets/drugs_management/CatFever.png" alt />
                感冒发烧
              </span>
            </el-tag>
            <el-tag type="info" v-else-if="scope.row.classify === '男科用药'">
              <span>
                <img src="../../assets/drugs_management/MaleDrugs.png" alt />
                男科用药
              </span>
            </el-tag>
            <el-tag type="info" v-else-if="scope.row.classify === '妇科用药'">
              <span>
                <img src="../../assets/drugs_management/GynecologicalDrugs.png" alt />
                妇科用药
              </span>
            </el-tag>
            <el-tag type="info" v-else-if="scope.row.classify === '两性用品'">
              <span>
                <img src="../../assets/drugs_management/BothSexesSupplies.png" alt />
                两性用品
              </span>
            </el-tag>
            <el-tag type="info" v-else-if="scope.row.classify === '心脑血管'">
              <span>
                <img src="../../assets/drugs_management/cardiacCerebralVessels.png" alt />
                心脑血管
              </span>
            </el-tag>
            <el-tag type="info" v-else-if="scope.row.classify === '儿科用药'">
              <span>
                <img src="../../assets/drugs_management/PediatricsDrugs.png" alt />
                儿科用药
              </span>
            </el-tag>
            <el-tag type="info" v-else-if="scope.row.classify === '老人用药'">
              <span>
                <img src="../../assets/drugs_management/OldManDrugs.png" alt />
                老人用药
              </span>
            </el-tag>
            <el-tag type="info" v-else-if="scope.row.classify === '营养保健'">
              <span>
                <img src="../../assets/drugs_management/NutritionHealthcare.png" alt />
                营养保健
              </span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="effect" label="作用" width="520px"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editDrugDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removDrugByIdDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
    <!-- 分页区域 -->

    <!-- 对话框 -->
    <!-- 这是点击添加药品的对话框 -->
    <el-dialog
      title="添加药品"
      :visible.sync="addDrugDialogVisible"
      width="30%"
      :before-close="addHandleClose"
    >
      <!-- 内容主体区域  表单验证-->
      <el-form
        :model="addDrugForm"
        :rules="addDrugFormRules"
        ref="addDrugFormRef"
        label-width="100px"
      >
        <!-- 药品名 -->
        <el-form-item label="药品名" prop="drugsName">
          <el-input v-model="addDrugForm.drugsName" placeholder="请输入药品名"></el-input>
        </el-form-item>
        <!-- 规格 -->
        <el-form-item label="规格" prop="specification">
          <el-input v-model="addDrugForm.specification" placeholder="请描述药品规格"></el-input>
        </el-form-item>
        <!-- 价格￥ -->
        <el-form-item label="价格￥" prop="price">
          <el-input v-model="addDrugForm.price" placeholder="请输入药品价格￥"></el-input>
        </el-form-item>
        <!-- 分类 -->
        <el-form-item label="分类" prop="classify">
          <el-select v-model="addDrugForm.classify" clearable placeholder="请选择分类">
            <el-option
              v-for="item in classify"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 作用 -->
        <el-form-item label="作用" prop="effect">
          <el-input v-model="addDrugForm.effect" placeholder="请描述药品作用"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddDrugDialogVisible">取 消</el-button>
        <el-button type="primary" @click="addDrug">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 这是 修改药品信息 的对话框  -->
    <el-dialog
      title="修改药品信息"
      :visible.sync="editDrugDialogVisible"
      width="30%"
      :before-close="editHandleClose"
    >
      <el-form
        :model="editDrugForm"
        :rules="editDrugFormRules"
        ref="editDrugFormRef"
        label-width="100px"
      >
        <!-- 药品名 -->
        <el-form-item label="药品名" prop="drugsName">
          <el-input
            v-model="editDrugForm.drugsName"
            prefix-icon="el-icon-lock"
            placeholder="请输入药品名"
          ></el-input>
        </el-form-item>
        <!-- 规格 -->
        <el-form-item label="规格" prop="specification">
          <el-input v-model="editDrugForm.specification" placeholder="请描述药品规格"></el-input>
        </el-form-item>
        <!-- 价格￥ -->
        <el-form-item label="价格￥" prop="price">
          <el-input v-model="editDrugForm.price" placeholder="请输入药品价格￥"></el-input>
        </el-form-item>
        <!-- 分类 -->
        <el-form-item label="分类" prop="classify">
          <el-select v-model="editDrugForm.classify" clearable placeholder="请选择分类">
            <el-option
              v-for="item in editClassify"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 作用 -->
        <el-form-item label="作用" prop="effect">
          <el-input v-model="editDrugForm.effect" placeholder="请描述药品作用"></el-input>
        </el-form-item>

        <!-- 底部区域 -->
        <el-form-item>
          <el-button @click="cancelEditDrugDialogVisible">取 消</el-button>
          <el-button type="primary" @click="editDrug">确 定</el-button>
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
      // 获取药品列表数据
      drugsList: [],
      // 药品列表参数
      parameter: [
        { total: "" }, //总数
        { pageSize: "10" }, //当前每页显示多少条数据
        { pageNum: "1" } // 当前页码
      ],
      // 搜索表单,string
      searchDrugsForm: "",
      // // 控制添加药品对话框的显示与隐藏
      addDrugDialogVisible: false,
      // 添加药品表单数据
      addDrugForm: {
        picture: "",
        drugsName: "",
        specification: "",
        price: "",
        classify: "",
        effect: ""
      },
      // 选择药品分类
      classify: [
        {
          value: "感冒发烧",
          label: "感冒发烧"
        },
        {
          value: "男科用药",
          label: "男科用药"
        },
        {
          value: "妇科用药",
          label: "妇科用药"
        },
        {
          value: "两性用药",
          label: "两性用药"
        },
        {
          value: "心脑血管",
          label: "心脑血管"
        },
        {
          value: "儿科用药",
          label: "儿科用药"
        },
        {
          value: "老人用药",
          label: "老人用药"
        },
        {
          value: "营养保健",
          label: "营养保健"
        }
      ],
      // 添加药品校验规则
      addDrugFormRules: {
        // 药品名
        drugsName: [
          { required: true, message: "药品名不能为空", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "药品名的长度在2~15个字符之间",
            trigger: "blur"
          }
        ],
        // 规格
        specification: [
          { required: true, message: "规格不能为空", trigger: "blur" },
          {
            type: "string",
            min: 2,
            max: 20,
            message: "规格长度在2~20个字符之间",
            trigger: "blur"
          }
        ],
        // 价格
        price: [
          {
            required: true,
            message: "价格不能为空",
            trigger: "blur"
          },
          {
            min: 4,
            message: "请输入正确的价格,如10.00",
            trigger: "blur"
          },
          { required: true, validator: checkPrice, trigger: "blur" }
        ],
        // 分类
        classify: [
          { required: true, message: "分类不能为空", trigger: "blur" },
          
        ],
        // 作用
        effect: [
          { required: true, message: "作用不能为空", trigger: "blur" },
          {
            min: 3,
            max: 100,
            message: "作用的长度在3~100个字符之间",
            trigger: "blur"
          }
        ]
      },
      // 控制修改药品信息对话框的显示与隐藏
      editDrugDialogVisible: false,
      // 修改药品表单数据
      editDrugForm: {},
      // 真正的修改药品信息表单，经过判断不为空的存进来
      // 点击修改按钮后 获取当前一行药品的_id数据
      trueEditDrugForm: {
        _id: ""
      },
      // 删除药品的表单数据id
      trueRemoveDrugForm: {
        _id: ""
      },
      // 编辑药品分类
      editClassify: [
        {
          value: "感冒发烧",
          label: "感冒发烧"
        },
        {
          value: "男科用药",
          label: ""
        },
        {
          value: "妇科用药",
          label: "妇科用药"
        },
        {
          value: "两性用品",
          label: "两性用品"
        },
        {
          value: "心脑血管",
          label: "心脑血管"
        },
        {
          value: "儿科用药",
          label: "儿科用药"
        },
        {
          value: "老人用药",
          label: "老人用药"
        },
        {
          value: "营养保健",
          label: "营养保健"
        }
      ],
      // 修改药品验证规则
      editDrugFormRules: {
        // 药品名
        drugsName: [
          {
            min: 2,
            max: 15,
            message: "药品名的长度在2~15个字符之间",
            trigger: "change"
          }
        ],
        // 规格
        specification: [
          {
            min: 2,
            max: 20,
            message: "规格长度在2~20个字符之间",
            trigger: "change"
          }
        ],
        // 价格
        price: [
          {
            min: 4,
            message: "请输入正确的价格,如10.00",
            trigger: "change"
          },
          { required: false, validator: checkPrice, trigger: "change" }
        ],
        // 分类
        // 作用
        effect: [
          {
            min: 3,
            max: 100,
            message: "作用的长度在3~100个字符之间",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getDrugsList();
  },
  methods: {
    // 获取药品列表数据
    getDrugsList() {
      this.$http.get("drugs", { params: this.parameter }).then(res => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          return this.$message.error("获取药品列表失败！");
        } else {
          // 药品列表数据
          this.drugsList = res.data.data.drugs;
          // 药品列表参数
          this.parameter.total = res.data.data.total;
          // 药品照片
        }
      });
    },
    // 分页区域
    // 监听 pageSize（当前每页显示多少条数据） 事件
    handleSizeChange(pageSize) {
      console.log(`每页 ${pageSize} 条`);
      this.parameter[1].pageSize = pageSize;
      // 默认每次切换显示多少条数据的时候，页码总在第一页
      this.parameter[2].pageNum = 1;
      // console.log(this.searchDrugsForm )
      // 判断搜索还是不搜索的情况下的分页获取数据
      if (this.searchDrugsForm == "") {
        this.getDrugsList(); //  重新获取全部药品列表数据
      } else {
        this.searchDrugs(); //  重新获取搜索出来的药品列表数据
      }
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(pageNum) {
      // console.log(`当前页: ${pageNum}`);
      this.parameter[2].pageNum = pageNum;
      if (this.searchDrugsForm == "") {
        this.getDrugsList(); //  重新获取全部药品列表数据
      } else {
        this.searchDrugs(); //  重新获取搜索出来的药品列表数据
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
    searchDrugs(searchDrugsForm) {
      if (this.searchDrugsForm == "") {
        this.$message.error("搜索内容不能为空！");
      } else {
        // console.log(this.searchDrugsForm)
        this.$http
          .get("searchDrugs", {
            params: {
              searchDrugsForm: this.searchDrugsForm,
              parameter: this.parameter
            }
          })
          .then(res => {
            console.log(res);
            if (res.data.meta.status != 200) {
              this.$message.error("没有该内容，请更换关键词搜索！");
              this.searchDrugsForm = "";
            } else {
              // 搜索后的数据
              this.drugsList = res.data.data.searchDrug;
              // this.drugsList = res.data.data.searchDrugs;
              // 查询到的药品总数
              this.parameter.total = res.data.data.total;
            }
          });
      }
    },
    // 监听刷新按钮，实现获取全部药品列表和重置搜索表单
    refresh() {
      this.getDrugsList();
      this.$message.success("刷新成功！");
      this.searchDrugsForm = "";
    },

    //// 添加药品
    // 监听添加药品对话框 取消按钮，实现关闭和重置表单
    cancelAddDrugDialogVisible() {
      this.addHandleClose();
    },
    // 监听添加对话框关闭
    addHandleClose() {
      this.addDrugDialogVisible = false;
      this.$refs.addDrugFormRef.clearValidate(); //清空验证规则
      this.$refs.addDrugFormRef.resetFields(); //清空表单数据
    },
    // 确定按钮
    addDrug() {
      this.$refs.addDrugFormRef.validate(async valid => {
        if (!valid) return;
        // 判断是否选择药品分类，不能为空
        // if (this.addDrugForm.classify != "") {
          // 表单addDrugForm携带数据，在服务器拿到数据会自动验证
          this.$http
            .post("addDrug", {
              params: { addDrugForm: this.addDrugForm }
            })
            .then(res => {
              console.log(res);
              // if (res.data.meta.status != 200) {
              //   this.$message.error("药品已存在！");
              // } else {
              //   // 获取添加药品后的药品列表
              //   this.getDrugsList();
              //   this.$message.success("添加新药品成功！");
              //   this.addDrugDialogVisible = false;
              //   this.addDrugForm = {};
            //     var username = res.data.data.addAdmin.username; //当前添加的用户
            // return this.$notify.success({
            //   title: "添加成功！",
            //   message: "已成功添加新管理员" + username
            // });
              // }
            });
        // } else {
        //   this.$message.error("分类不能为空！");
        // }
      });
    },

    //// 监听修改药品信息的按钮
    editDrugDialog(_id) {
      // 打开对话框
      this.editDrugDialogVisible = true;
      // console.log(_id);
      // // 将获取到的当前一行药品的id保存到 trueEditDrugForm 表单中
      this.trueEditDrugForm._id = _id;
    },
    // 监听修改对话框关闭事件
    editHandleClose() {
      this.editDrugDialogVisible = false;
      this.$refs.editDrugFormRef.clearValidate(); //清空验证规则
      this.$refs.editDrugFormRef.resetFields(); //清空表单数据
      // this.editDrugForm = {};
    },
    // 监听修改药品对话框 取消按钮，实现关闭和重置表单
    cancelEditDrugDialogVisible() {
      this.editHandleClose();
    },
    // 监听确定修改按钮   药品 对话框的确定按钮
    editDrug() {
      // 判断修改内容是否全部为空
      if (
        this.editDrugForm.picture == undefined &&
        this.editDrugForm.drugsName == undefined &&
        this.editDrugForm.specification == undefined &&
        this.editDrugForm.price == undefined &&
        this.editDrugForm.classify == undefined &&
        this.editDrugForm.effect == undefined
      ) {
        this.$message.error("修改内容不能都为空！");
      } else {
        this.$refs.editDrugFormRef.validate(async valid => {
          if (!valid) return;
          // 判断输入框是否为空，不是则赋值到 trueEditDrugForm 表单中
          if (this.editDrugForm.picture != "") {
            this.trueEditDrugForm.picture = this.editDrugForm.picture;
          }
          if (this.editDrugForm.drugsName != "") {
            this.trueEditDrugForm.drugsName = this.editDrugForm.drugsName;
          }
          if (this.editDrugForm.specification != "") {
            this.trueEditDrugForm.specification = this.editDrugForm.specification;
          }
          if (this.editDrugForm.price != "") {
            this.trueEditDrugForm.price = this.editDrugForm.price;
          }
          if (this.editDrugForm.classify != "") {
            this.trueEditDrugForm.classify = this.editDrugForm.classify;
          }
          if (this.editDrugForm.effect != "") {
            this.trueEditDrugForm.effect = this.editDrugForm.effect;
          }
          // 发送不为空的表单数据
          this.$http.post("editDrug", this.trueEditDrugForm).then(res => {
            // console.log(res);
            if (res.data.meta.status != 200) {
              this.$message.error("修改药品信息失败！");
            } else {
              // 获取修改后的药品列表
              this.getDrugsList();
              this.editHandleClose();
              return this.$notify.success({
                title: "成功！",
                message: "已修改药品信息成功！"
              });
            }
          });
        });
      }
    },

    //// 监听删除药品按钮
    async removDrugByIdDialog(_id) {
      // 输出当前一行药品的id
      // console.log(_id);
      // // 将获取到的一行的id保存到 trueRemoveDrugForm 表单中
      this.trueRemoveDrugForm._id = _id;
      // 打开对话框提示是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该药品, 是否继续?",
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
          message: "已取消删除该药品！"
        });
      }
      this.$http.post("deleteDrug", this.trueRemoveDrugForm).then(res => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          this.$message.error("删除该药品失败！");
        } else {
          // 获取删除后的药品列表
          this.getDrugsList();
          return this.$notify.success({
            title: "成功！",
            message: "已成功删除该药品！"
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
// 面包屑导航区域,在全局样式（global.css）里面统一设定

// 分类
.el-card {
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
  }
  img {
    margin-right: 5px;
    width: 20px;
    height: 20px;
  }
  .drug_picture {
    width: 100px;
    height: 80px;
  }
  .drug_picture {
    width: 100px;
    height: 80px;
  }
  //   .el-card{
  //     position: absolute;
  //   }
  //   .block{
  // position: relative;
  // bottom: 10px;
  //   }
}
</style>