<template>
  <div class="cat_fever">
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
          <img src="../../assets/drugs_management/CatFever.png" alt />感冒发烧
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 内容 -->
      <el-table :data="catFeverList" border height="720px" width="100%">
        <!-- 索引 -->
        <el-table-column type="index" width="60px"></el-table-column>
        <el-table-column prop="drugsName" label="药品名"></el-table-column>
        <el-table-column prop="specification" label="规格"></el-table-column>
        <el-table-column label="价格￥">
          <template slot-scope="scope">{{scope.row.price}}￥</template>
        </el-table-column>
        <el-table-column prop="classify" label="类别">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.classify === '感冒发烧'">
              <span>
                <img src="../../assets/drugs_management/CatFever.png" alt />
                感冒发烧
              </span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="effect" label="作用"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取 感冒发烧 类别列表数据
      catFeverList: []
    };
  },
  created() {
    this.getCatFeverList();
  },
  methods: {
    // 获取 感冒发烧 类别列表数据
    getCatFeverList() {
      this.$http
        .get("catFever", { params: { classify: "感冒发烧" } })
        .then(res => {
          // console.log(res);
          if (res.data.meta.status != 200) {
            return this.$message.error("没有找到感冒发烧类别的数据！");
          } else {
            this.catFeverList = res.data.catFever;
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
}
</style>