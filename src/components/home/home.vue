<template>
  <el-container class="home">
    <!-- 左侧导航区域 -->
    <!-- 根据折叠按钮动态赋值宽度，以达到左侧菜单区域折叠后宽度缩小 -->
    <el-aside :width="isCollapse ? '80px' : '300px'">
      <!-- <el-aside width="auto"> -->
      <el-menu
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#409EFF"
        :collapse="isCollapse"
        :collapse-transition="false"
        unique-opened
        router
      >
        <!-- 菜单标题 -->
        <el-menu-item class="menu_title">
          <div>
            <img src="../../assets/logo.png" alt />
            <span>系统菜单导航</span>
          </div>
        </el-menu-item>

        <!-- 一级菜单 -->
        <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
          <template slot="title">
            <div class="tittle_one">
              <i :class="oneMenuIcon[item.id]"></i>
              <span>{{item.oneMenuName}}</span>
            </div>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item :index="twoItem.path" v-for="twoItem in item.children" :key="twoItem.id">
            <img :src="twoMenuIcon[twoItem.id]" alt />
            <i :class="twoMenuIcon[twoItem.id]"></i>
            <span>{{twoItem.twoMenuName}}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <!-- 头部左侧 -->
        <div class="header_left">
          <el-tooltip effect="dark" content="折叠菜单" placement="bottom" :enterable="false">
            <!-- 判断点击collapsed_icon后 在style样式选中collapsed_icon_right  旋转180度 -->
            <i
              :class="[isCollapse? 'collapsed_icon_left' : 'collapsed_icon_right']"
              class="el-icon-s-unfold"
              @click="collapsed_icon"
            ></i>
          </el-tooltip>
          <span>尊敬的 {{sloganForm.username}}</span>
          <span>欢迎登陆网上药店管理系统!</span>
        </div>
        <!-- 头部右侧 -->
        <div class="header_right">
          <el-tooltip effect="dark" content="退出" placement="bottom" :enterable="false">
            <el-button round @click="logout">退出</el-button>
          </el-tooltip>
        </div>
      </el-header>
      <!-- 内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 底部区域 -->
      <el-footer>
        <span>2019--2020 @网上药店管理系统</span>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单是否折叠
      isCollapse: false,
      // 头部左侧显示登录用户名的标语表单数据
      sloganForm: {
        username: ""
      },
      // 左侧菜单数据
      menuList: [],
      // 一级菜单图标
      oneMenuIcon: {
        "100": "el-icon-first-aid-kit",
        "200": "el-icon-truck",
        "300": "el-icon-lock",
        "400": "el-icon-user",
        "500": "el-icon-star-off"
      },
      // 二级菜单图标
      twoMenuIcon: {
        "101": require("../../assets/drugs_management/DrugsList.png"),
        "102": require("../../assets/drugs_management/CatFever.png"),
        "103": require("../../assets/drugs_management/MaleDrugs.png"),
        "104": require("../../assets/drugs_management/GynecologicalDrugs.png"),
        "105": require("../../assets/drugs_management/BothSexesSupplies.png"),
        "106": require("../../assets/drugs_management/cardiacCerebralVessels.png"),
        "107": require("../../assets/drugs_management/PediatricsDrugs.png"),
        "108": require("../../assets/drugs_management/OldManDrugs.png"),
        "109": require("../../assets/drugs_management/NutritionHealthcare.png"),
        "201": "el-icon-document-copy",
        "301": "el-icon-tickets",
        "302": "el-icon-document",
        "401": "el-icon-s-custom",
        "402": "el-icon-document-remove",
        "501": "el-icon-star-off"
      }
    };
  },
  created() {
    this.getUserName(); // 获取头部欢迎标语前的当前登录的 用户名
    this.getMenus(); //获取当前登录用户相应权限的菜单
  },
  methods: {
    // 获取头部欢迎标语前的当前登录的 用户名
    getUserName() {
      // 从 sessionStorage 获取当前登录的用户的id
      var id = sessionStorage.getItem("id");
      // console.log(id)
      this.$http.get("username", { params: { id: id } }).then(res => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          return this.$message.error("获取信息列表失败！");
        } else {
          this.sloganForm.username= res.data.username;
        }
      });
    },
    // 获取相应权限的菜单
    getMenus() {
      // 判断当前登录的角色，获取相应权限的菜单
      // 从 sessionStorage 获取当前登录的用户的角色
      var role = sessionStorage.getItem("role");
      // console.log(sessionStorage.getItem("role"))
      this.$http.get("menus", { params: { role: role } }).then(res => {
        // console.log(res)
        if (res.data.meta.status != 200) {
          return this.$message.error("获取菜单失败！");
        } else {
          // this.$message.success("获取菜单成功！");
          this.menuList = res.data.menus;
        }
      });
    },

    // 退出当前登录
    logout() {
      this.$router.push("/");
      var username = sessionStorage.getItem("username");
      var role = sessionStorage.getItem("role");
       this.$notify.success({
        title: "退出成功！",
        message:
          "尊敬的 " +
          username +
          " [ " +
          role +
          "] " +
          "期待您的下次登录！" 
      });
      
     return window.sessionStorage.clear();
    },
    // 折叠左侧菜单
    collapsed_icon() {
      this.isCollapse = !this.isCollapse;
      // console.log(this.isCollapse)
    }
  }
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%; // 填充全屏
  background-color: #f5f7f9;
  // 左侧导航区域
  .el-aside {
    //CSS3  绑定左侧导航区域范围
    overflow-x: hidden; //对内容的左/右边缘进行裁剪，不提供滚动机制。
    overflow-y: scroll; //对内容的上/下边缘进行裁剪，提供滚动机制scroll
    background-color: #545c64; // 左侧整体菜单背景
    // 菜单
    .el-menu {
      border-right: none; // 菜单侧边线条
      // 一级菜单
      .el-submenu {
        padding-bottom: 30px; //一级菜单上下间距
        .tittle_one {
          //一级菜单icon
          i {
            font-size: 25px;
            color: #fff;
            margin-right: 7px;
          }
          //一级菜单文字
          span {
            font-size: 25px;
            font-weight: 300;
          }
        }
      }
      // 二级菜单
      .el-menu-item {
        margin-top: 15px;
        // padding-bottom: 10px; //二级菜单上下间距
        //二级菜单icon
        img {
          width: 25px;
          height: 25px;
        }
        i {
          font-size: 20px;
          margin-right: 2px;
        }
        //二级菜单文字
        span {
          font-size: 20px;
          font-weight: 300;
        }
      }
    }
  }
  // 个人中心、菜单logo标题为二级菜单，但在一级显示，
  // 为样式与一级同意，单独设置样式覆盖原有的二级样式
  .personal_center {
    margin-top: -15px;
    i {
      font-size: 25px !important;
    }
    span {
      font-size: 25px !important;
      font-weight: 300 !important;
    }
  }
  // 菜单logo、标题
  .menu_title {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    height: 70px !important;
    margin-top: -0px !important;
    background-color: rgb(69, 70, 73) !important;
    img {
      margin-left: -25px;
      width: 100px !important;
      height: 100px !important;
      margin-right: -10px;
      margin-top: 5px;
    }
    span {
      font-size: 32px !important;
      font-weight: 300 !important;
      color: #fff !important;
      margin-left: -15px;
    }
  }
}
// 头部区域
.el-header {
  height: 70px !important;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  .header_left {
    margin-left: -10px;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      font-size: 45px;
      margin-right: 30px;
    }
    span {
      font-size: 30px;
      // margin-left: 10px;
      margin-right: 10px;
    }
    // 折叠菜单图标箭头向左边时候样式为 默认状态
    .collapsed_icon_left {
      font-size: 45px;
      margin-right: 30px;
    }
    // 折叠菜单图标箭头向右边的样式设计
    .collapsed_icon_right {
      transform: rotate(180deg);
      transition: all 1s;
    }
  }
  .header_right {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
// 内容区域
// .el-main{
//   width: auto;
//   height: 600px !important;
// }
// 底部区域
.el-footer {
  height: 30px !important;
  // margin-top: 5px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 10px;
    font-weight: 300;
  }
}
</style>