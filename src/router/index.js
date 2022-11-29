import Layout from "@/layout/index.vue";

const constRouterList = [
  {
    path: "/login",
    name: 'login',
    hidden: true,
    component: () => import(/* webpackChunkName: "about" */  '@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: "/",
    component: Layout,
    redirect: "/index",
    parent: true,
    children: [
      {
        path: '/index',
        name: 'index',
        component: () => import(/* webpackChunkName: "about" */ '@/views/index/index.vue'),
        meta: {
          title: '首页',
        }
      },
    ]
  },
  // {
  //   path: '/partner',
  //   name: 'partner',
  //   component:Layout,
  //   // redirect: "/partner/company",
  //   meta: {
  //     title: '合作方管理',
  //   },
  //   children:[
  //     {
  //       path:"/partner/company",
  //       name:"company",
  //       component: () => import(/* webpackChunkName: "about" */ '@/views/partner/company/index.vue'),
  //       meta: {
  //         title: '企业管理',
  //       }
  //     },
  //     {
  //       path:"/partner/user",
  //       name:"user",
  //       component: () => import(/* webpackChunkName: "about" */ '@/views/partner/user/index.vue'),
  //       meta: {
  //         title: '商家管理',
  //       }
  //     },
  //     {
  //       path:"/partner/supplier",
  //       name:"supplier",
  //       component: () => import(/* webpackChunkName: "about" */ '@/views/partner/supplier/index.vue'),
  //       meta: {
  //         title: '供应商管理',
  //       }
  //     },
  //     {
  //       path:"/partner/agent",
  //       name:"agent",
  //       component: () => import(/* webpackChunkName: "about" */ '@/views/partner/agent/index.vue'),
  //       meta: {
  //         title: '代理商管理',
  //       }
  //     },
  //   ]
  // },
  // {
  //   path: "/",
  //   component: Layout,
  //   redirect: "/billing",
  //   parent: true,
  //   children: [
  //     {
  //       path: '/billing',
  //       name: 'billing',
  //       component: () => import(/* webpackChunkName: "about" */ '@/views/billing/billing/index.vue'),
  //       meta: {
  //         title: '计费管理',
  //       }
  //     },
  //   ]
  // },
  // {
  //   path: "/",
  //   component: Layout,
  //   redirect: "/line",
  //   parent: true,
  //   children: [
  //     {
  //       path: '/line',
  //       name: 'line',
  //       component: () => import(/* webpackChunkName: "about" */ '@/views/line/line/index.vue'),
  //       meta: {
  //         title: '语音线路管理',
  //       }
  //     },
  //   ]
  // },
  // {
  //   path: "/",
  //   component: Layout,
  //   redirect: "/IVR",
  //   parent: true,
  //   children: [
  //     {
  //       path: '/IVR',
  //       name: 'IVR',
  //       component: () => import(/* webpackChunkName: "about" */ '@/views/IVR/IVR/index.vue'),
  //       meta: {
  //         title: 'IVR管理',
  //       }
  //     },
  //   ]
  // },
  
  
]

export default constRouterList

