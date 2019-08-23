import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import '@/utils/global'
import {post, get} from './utils/http'
import './utils/permission'

// 定义全局变量
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$store = store

// ElementUI引用
Vue.use(ElementUI)

new Vue ({
  el: '#app',
  router,
  store,
  render: h => h(App)
})


