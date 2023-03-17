import Vue from 'vue'
import App from './App.vue'
import jQueryJson from 'jquery-json'
import router from './router/setting.js'
import element from "element-ui"
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import "./assets/css/index.scss"
import callPlugin from "./utils/plugin"

Vue.config.productionTip = false

Vue.use(jQueryJson)
Vue.use(element)
Vue.use(callPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
