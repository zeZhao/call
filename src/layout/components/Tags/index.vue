<template>
  <div class="tags">
    <div class="list">
      <!-- <el-tag @click="skip({path:'/index'})">首页</el-tag> -->
      <el-tag
        v-for="tag in tags"
        :key="tag.path"
        closable
        @click="skip(tag)"
        @close="close(tag)"
        :class="{ 'tag_active': tag.active }"
        >{{ tag.meta.title || 'no-name' }}</el-tag
      >
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      tags: [
        {path:'/index',meta:{title:'首页'}}
      ],
    };
  },
  created() {
    this.addTag()
  },
  mounted() {},
  computed: {},
  methods: {
    //添加tag
    addTag() {
      //active代表当前选中状态
      let route = this.$route;
      let tag = Object.assign({}, route);
      // 首页路径 不添加进去
      let indexPath = "/index";
      if ((this.tags && this.tags.length > 0) || tag.path === indexPath) {
        let pathList = this.tags.map((item) => item.path);
        if (!pathList.includes(tag.path)) {
          if (indexPath !== tag.path) {
            this.tags.push(tag);
          }
        }
      } else {
        this.tags.push(tag);
      }
      this.active(tag);
    },
    // 点击tag跳转
    skip(tag) {
      let route = this.$route;
      if (tag.path !== route.path) {
        this.$router.push({
          path: tag.path,
        });
        this.active(tag);
      }
    },
    // 关闭tag
    close(tag) {
      let route = this.$route;
      this.tags.forEach((item, index) => {
        if (item.path === tag.path) {
          this.tags.splice(index, 1);
        }
        if(tag.path === route.path){
          this.skip(this.tags[this.tags.length-1])
        }
      });
    },
    //设置选中状态
    active(tag) {
      this.tags.forEach((item) => {
        if (item.path === tag.path) {
          this.$set(item,'active',true)
        } else {
          this.$set(item,'active',false)
        }
      });
    },
  },
  watch: {
    $route() {
      this.addTag();
    },
  },
};
</script>
<style lang="scss" scoped>
.tags {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  
  .list {
    text-align: left;
    overflow-x: auto;
    .el-tag {
      background-color: #fafafa;
      color: #575757;
      border-color: #fafafa;
      cursor: pointer;
      margin-right: 5px;
    }
    .el-tag:hover {
      background-color: #ecf5ff;
      color: #409eff;
      border: 1px solid #d9ecff;
    }
    .tag_active {
      background-color: #ecf5ff;
      color: #409eff;
      border: 1px solid #d9ecff;
    }
    &::-webkit-scrollbar {
      width: 1px;
      height: 5px;
    }
    /* 滚动槽 */
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #f5f6f7;
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #DCDDDF;
      -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
    }
    &::-webkit-scrollbar-thumb:hover {
      border-radius: 10px;
      // background: red;
      background: #C7C9CC;
      -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
    }
  }
}
</style>
