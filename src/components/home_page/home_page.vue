<template>
  <div class="home_page">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="el-icon-s-home" :to="{ path: '/home_page' }">首页</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box_card">
      <span>网上药店管理系统后台</span>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
// 面包屑导航区域,在全局样式（global.css）里面统一设定

//
.box_card {
  cursor:pointer;
  background-color: #2b4b6b;
  height: 750px !important;
  span{
    color: white;
    font-size: 70px;
    display: flex;
    justify-content: center;
    margin-top: 300px;
  }
}
</style>