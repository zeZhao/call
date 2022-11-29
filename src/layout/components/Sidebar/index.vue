<template>
  <div class="Sidebar">
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical"
      @open="handleOpen"
      @close="handleClose"
      router
      background-color="#182131"
      text-color="#ffffff"
      active-text-color="#ffffff"
    >
      <div v-for="item in routeList" :key="item.path">
        <div v-if="item.children && item.children.length != 0">
          <el-submenu :index="item.path">
            <template slot="title">
              <div class="menu_icon">
                <i class="el-icon-location"></i>
              </div>
              <span>{{ item.meta.title }}</span>
            </template>
            <el-menu-item-group v-for="el in item.children" :key="el.path">
              <el-menu-item :index="el.path">{{ el.meta.title }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </div>
        <div v-else>
          <el-menu-item :index="item.path">
            <div class="menu_icon">
              <i class="el-icon-location"></i>
            </div>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>
import constRouterList from "@/router";
export default {
  data() {
    return {
      routes: [],
    };
  },
  computed: {
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    routeList() {
      let newRouterList =  constRouterList.filter((v) => !v.hidden);
      let arr = []
      newRouterList.forEach(item=>{
        if(item.parent){
          arr.push(...item.children)
        }else{
          arr.push(item)
        }
      })
      return arr
    },
  },
  mounted() {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>
<style lang="scss" scoped>
$sidebarBackColor: #0964ff;
.Sidebar {
  width: 175px;
  height: calc(100vh - 50px);
  .el-menu-vertical {
    width: 100%;
    height: 100%;
    .menu_icon {
      display: inline-block;
      margin-right: 8px;
      vertical-align: baseline;
    }
    .el-menu-item.is-active{
      background-color: $sidebarBackColor !important;
    }
    .el-menu-item,
    .el-submenu__title {
      height: 40px !important;
      line-height: 40px !important;
      padding: 0 16px 0 12px !important;
      text-align: left;
      &:hover {
        background-color: $sidebarBackColor !important;
      }
    }
    ::v-deep .el-submenu {
      &:hover {
        background-color: $sidebarBackColor !important;
      }
      .el-submenu__icon-arrow {
        font-size: 15px;
        color: #bbbfc4 !important;
      }
      .el-submenu__title {
        height: 40px !important;
        line-height: 40px !important;
        padding: 0 16px 0 12px !important;
        text-align: left;
        &:hover {
          background-color: $sidebarBackColor !important;
        }
      }
      .el-menu {
        .el-menu-item-group {
          .el-menu-item {
            padding-left: 49px !important;
          }
        }
      }
      .el-menu-item-group__title {
        display: none;
      }
      .el-icon-arrow-down:before {
        content: "\e790";
      }
      .el-icon-arrow-up:before {
        content: "\e78f";
      }
    }
  }
  // .el-menu-item {
  //   border-left: 3px solid #fff;
  //   .img {
  //     width: 16px;
  //     height: 16px;
  //     display: inline-block;
  //     margin-right: 10px;
  //     img {
  //       width: 100%;
  //       height: 100%;
  //     }
  //   }
  // }
  // .el-menu-item:first-child {
  //   margin-top: 8px;
  // }
  // .is-active {
  //   background: #f3f9ff;
  //   font-size: 14px;
  //   color: #2b2f36;
  //   border-left: 3px solid #1890ff;
  // }
}
</style>
