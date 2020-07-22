<template>
  <div class="permission_list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home_page' }">
        <i class="el-icon-s-home">首页</i>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span class="el-icon-lock">权限管理</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span class="el-icon-tickets">权限列表</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-table :data="permissionList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="permissionName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="permissionLevel">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.permissionLevel === '1'">一级权限</el-tag>
            <el-tag type="warning" v-else-if="scope.row.permissionLevel === '2'">二级权限</el-tag>
            <el-tag type="info" v-else-if="scope.row.permissionLevel === '3'">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      permissionList: [],
    };
  },
  created() {
    this.$http.get("permissions").then(res => {
      // console.log(res.data);
      this.permissionList = res.data.data.permissions;
    });
  }
};
</script>

<style lang="less" scoped>
// 面包屑导航区域,在全局样式（global.css）里面统一设定
</style>