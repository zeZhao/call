import Vue from 'vue'
import App from './App.vue'
import jQuery from 'jquery'
import jQueryJson from 'jquery-json'
import router from './router/setting.js'
import element from "element-ui"
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import "./assets/css/index.scss"
import callPlugin from "./utils/plugin"
require('./assets/js/verto-min')

Vue.config.productionTip = false


Vue.use(jQuery)
Vue.use(jQueryJson)
Vue.use(element)
Vue.use(callPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
