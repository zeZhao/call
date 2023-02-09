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
  {
    path: '/B-Call',
    name: 'B-Call',
    component: Layout,
    meta: {
      title: '自动外呼',
    },
    children: [
      // {
      //   path: '/B-Call/outbound',
      //   name: 'outbound',
      //   component: () => import(/* webpackChunkName: "about" */ '@/views/B-Call/outbound/index.vue'),
      //   meta: {
      //     title: '外呼任务',
      //   },
      // },
      {
        path: '/B-Call/incomeCallManage',
        name: 'incomeCallManage',
        component: () => import(/* webpackChunkName: "about" */ '@/views/B-Call/incomeCallManage/index.vue'),
        meta: {
          title: '外呼任务',
        },
      },
      {
        path: '/B-Call/callMataManagement',
        name: 'callMataManagement',
        component: () => import(/* webpackChunkName: "about" */ '@/views/B-Call/callMataManagement/index.vue'),
        meta: {
          title: '外呼数据管理',
        },
      },
    ]
  },
  {
    path: '/dataQuery',
    name: 'dataQuery',
    component: Layout,
    meta: {
      title: '数据查询',
    },
    children: [
      {
        path: '/dataQuery/callList',
        name: 'callList',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataQuery/callList/index.vue'),
        meta: {
          title: '通话详单',
        },
      },
      {
        path: '/dataQuery/PhoneLog',
        name: 'PhoneLog',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataQuery/PhoneLog/index.vue'),
        meta: {
          title: '短信记录',
        },
      },
      {
        path: '/dataQuery/AIrecord',
        name: 'AIrecord',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataQuery/AIrecord/index.vue'),
        meta: {
          title: 'AI对话记录',
        },
      },
      {
        path: '/dataQuery/recording',
        name: 'recording',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataQuery/recording/index.vue'),
        meta: {
          title: '录音记录',
        },
      },
    ]
  },
  {
    path: '/seats',
    name: 'seats',
    component: Layout,
    meta: {
      title: '系统管理',
    },
    children: [
      // {
      //   path: '/seats/extension',
      //   name: 'extension',
      //   component: () => import(/* webpackChunkName: "about" */ '@/views/seats/extension/index.vue'),
      //   meta: {
      //     title: '分机',
      //   },
      // },
      {
        path: '/seats/seatsIndex',
        name: 'seats',
        component: () => import(/* webpackChunkName: "about" */ '@/views/seats/seatsIndex/index.vue'),
        meta: {
          title: '坐席',
        },
      },
      {
        path: '/seats/permission',
        name: 'permission',
        hidden: false,
        component: () => import(/* webpackChunkName: "about" */ '@/views/seats/permission/index.vue'),
        meta: {
          title: '坐席权限',
        },
      },
      {
        path: '/seats/skillGroups',
        name: 'skillGroups',
        hidden: false,
        component: () => import(/* webpackChunkName: "about" */ '@/views/seats/skillGroups/index.vue'),
        meta: {
          title: '技能组',
        },
      },
    ]
  },
  
  
]

export default constRouterList

