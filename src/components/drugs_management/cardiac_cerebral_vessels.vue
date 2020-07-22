<template>
  <div class="cardiac_cerebral_vessels">
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
          <img src="../../assets/drugs_management/cardiacCerebralVessels.png" alt />心脑血管
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 内容 -->
      <el-table :data="gardiocerebralVesselsList" border height="720px" width="100%">
        <!-- 索引 -->
        <el-table-column type="index" width="60px"></el-table-column>
        <el-table-column prop="drugsName" label="药品名"></el-table-column>
        <el-table-column prop="specification" label="规格"></el-table-column>
        <el-table-column label="价格￥" width="150px">
          <template slot-scope="scope">{{scope.row.price}}￥</template>
        </el-table-column>
        <el-table-column prop="classify" label="类别">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.classify === '心脑血管'">
              <span>
                <img src="../../assets/drugs_management/cardiacCerebralVessels.png" alt />
                心脑血管
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
      // 获取 心脑血管 类别列表数据
      gardiocerebralVesselsList: []
    };
  },
  created() {
    this.getGardiocerebralVesselsList();
  },
  methods: {
    // 获取 心脑血管 类别列表数据
    getGardiocerebralVesselsList() {
      this.$http
        .get("garDioCerebralVessels", { params: { classify: "心脑血管" } })
        .then(res => {
          // console.log(res);
          if (res.data.meta.status != 200) {
            return this.$message.error("没有找到心脑血管类别的数据！");
          } else {
            this.gardiocerebralVesselsList = res.data.gardiocerebralVessels;
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