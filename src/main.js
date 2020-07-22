// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
// 引入view
// import ViewUI from 'view-design';
// import 'view-design/dist/styles/iview.css';
// Vue.use(ViewUI);

// // 引入axios
// import axios from 'axios'
// // 创建一个axios请求实例， 以便在任何vue界面都可以使用this.$tttp访问到axios实例。加$是为了不让http名产生冲突
// Vue.prototype.$http =  axios.create({
//   baseURL:'http://localhost:3001/api'
// })
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://localhost:3001/api'
Vue.prototype.$http = axios

// 导入全局样式表
import './assets/css/global.css';

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
