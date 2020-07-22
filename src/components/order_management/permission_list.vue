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
        <el-table-column label="路径名" prop="permissionName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        
        <el-table-column label="角色 (权限拥有者)" prop="role"></el-table-column>
        <el-table-column label="权限级别" prop="permissionLevel">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.permissionLevel === '一级'">一级权限</el-tag>
            <el-tag type="success" v-else-if="scope.row.permissionLevel === '二级'">二级权限</el-tag>
            <el-tag type="info" v-else-if="scope.row.permissionLevel === '三级'">三级权限</el-tag>
            <el-tag type="danger" v-else-if="scope.row.permissionLevel === '四级'">四级权限</el-tag>
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