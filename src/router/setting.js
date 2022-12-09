import Vue from 'vue'
import VueRouter from 'vue-router'
import constRouterList from "@/router"
import { getStorage } from "@/utils/auth";

Vue.use(VueRouter)

const router = new VueRouter({
  routes: constRouterList
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.name == 'login') {
    next();
  } else {
    let token = getStorage('token');
    if (token) {
      next();
    } else {
      // next()
      next({
        path: '/login'
      });
    }
  }
})



export default router











