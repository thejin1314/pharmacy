import Vue from 'vue'
import VueRouter from 'vue-router'

// 解决连续点击同一路由报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  // 监听 / 地址，并将其重定向到login
  {
    path: "/",
    component: () => import("../components/login/login.vue"),
    redirect: {
      name: "login"
    }
  },
  // 登录
  {
    path: "/login",
    name: "login",
    component: () => import("../components/login/login.vue"),
  },
  // 首页
  {
    path: "/home",
    name: "home",
    component: () => import("../components/home/home.vue"),
    redirect: "/home_page",
    meta: {
      requiredAuth: true
    },
    children: [
      //// 欢迎登陆网上药店管理系统
      {
        path: '/home_page',
        name: 'home_page',
        component: () => import("../components/home_page/home_page.vue"),
        meta: {
          requiredAuth: true
        }
      },

      //// 药品管理/药品列表
      {
        path: '/drugs_list',
        name: 'drugs_list',
        component: () => import("../components/drugs_management/drugs_list.vue"),
        meta: {
          requiredAuth: true
        }
      },
      // 药品管理/感冒发烧
      {
        path: '/cat_fever',
        name: 'cat_fever',
        component: () => import("../components/drugs_management/cat_fever.vue"),
        meta: {
          requiredAuth: true
        }
      },
      // 药品管理/男科用药
      {
        path: '/male_drugs',
        name: 'male_drugs',
        component: () => import("../components/drugs_management/male_drugs.vue"),
        meta: {
          requiredAuth: true
        }
      },
      // 药品管理/妇科用药
      {
        path: '/gynecological_drugs',
        name: 'gynecological_drugs',
        component: () => import("../components/drugs_management/gynecological_drugs.vue"),
        meta: {
          requiredAuth: true
        }
      },
      // 药品管理/两性用品
      {
        path: '/bothsexes_supplies',
        name: 'bothsexes_supplies',
        component: () => import("../components/drugs_management/bothsexes_supplies.vue"),
        meta: {
          requiredAuth: true
        }
      },
      // 药品管理/心脑血管
      {
        path: '/cardiac_cerebral_vessels',
        name: 'cardiac_cerebral_vessels',
        component: () => import("../components/drugs_management/cardiac_cerebral_vessels.vue"),
        meta: {
          requiredAuth: true
        }
      },
      // 药品管理/儿科用药
      {
        path: '/pediatrics_drugs',
        name: 'pediatrics_drugs',
        component: () => import("../components/drugs_management/pediatrics_drugs.vue"),
        meta: {
          requiredAuth: true
        }
      },
      // 药品管理/老人用药
      {
        path: '/oldman_drugs',
        name: 'oldman_drugs',
        component: () => import("../components/drugs_management/oldman_drugs.vue"),
        meta: {
          requiredAuth: true
        }
      },
      // 药品管理/营养保健
      {
        path: '/nutrition_healthcare',
        name: 'nutrition_healthcare',
        component: () => import("../components/drugs_management/nutrition_healthcare.vue"),
        meta: {
          requiredAuth: true
        }
      },


      //// 订单管理/订单列表
      {
        path: '/order_list',
        name: 'order_list',
        component: () => import("../components/order_management/order_list.vue"),
        meta: {
          requiredAuth: true
        }
      },
      // 权限管理/权限列表
      {
        path: '/permission_list',
        name: 'permission_list',
        component: () => import("../components/permission_management/permission_list.vue"),
        meta: {
          requiredAuth: true
        }
      },

      //// 权限管理/角色权限管理
      {
        path: '/role_permission_management',
        name: 'role_permission_management',
        component: () => import("../components/permission_management/role_permission_management.vue"),
        meta: {
          requiredAuth: true
        }
      },
      
//// 用户管理/管理员列表
      {
        path: '/admin_list',
        name: 'admin_list',
        component: () => import("../components/users_management/admin_list.vue"),
        meta: {
          requiredAuth: true
        }
      },
      //// 用户管理/用户列表
      {
        path: '/users_list',
        name: 'users_list',
        component: () => import("../components/users_management/users_list.vue"),
        meta: {
          requiredAuth: true
        }
      },
      

      //// 个人中心
      {
        path: '/personal_center',
        name: 'personal_center',
        component: () => import("../components/personal_center/personal_center.vue"),
        meta: {
          requiredAuth: true
        },
      },
    ],
  }
]
const router = new VueRouter({
  routes
});
// 暴露路由对象
export default router;
// 以下都是需要点击才会触发，还有一种就是当token过期但是当前sessionStorage任然有token值，
// 需要用拦截器获取后端返回过期时候的状态码
// // 挂载路由导航守卫
// 基本逻辑：
// 1.一定要从/login页面进来才可访问其他页面，否则自动跳转到/logins登录页面
// 2.检测路由是否需要检验token值，如果失效则需要重新登录
router.beforeEach((to, from, next) => {
  // to 即将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  if (to.meta.requiredAuth) {
    //判断该路由（需要跳转的）是否需要登录权限（路由上设计有）
    // console.log(sessionStorage.getItem("token"))
    if (sessionStorage.getItem("token")) {
      next(); //跳转
    } else {
      // 检验到无token即退出到logins页面
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }, //将跳转的路由path作为参数，登录成功后跳转到该路由
      })
     return alert("token值已失效，请重新登录！")
    }
  }

  // 判断登录的情况  登录能正常保存token值则跳转，不行则打印输出
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // console.log(tokenStr)
  if (tokenStr) {
    return next()
  } else {
    console.log("token值无法保存到sessionStorage失败！ 无法登录！")
  }
})


