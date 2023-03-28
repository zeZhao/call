<template>
  <div class="page">
    <el-col :span="24">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageObj.currentPage"
        :page-sizes="pageObj.pageSizes"
        :page-size="pageObj.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageObj.total"
      >
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "index",
  props: {
    pageObj: {
      type: Object,
      default: () => {
        return {
          pageObj: {
            currentPage: 0,
            total: 0,
            pageSize: 10,
            pageSizes: [10, 20, 30, 40, 50]
          }
        };
      }
    }
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {
    handleSizeChange(pageSize) {
      this.$emit("handleSizeChange", pageSize);
    },
    handleCurrentChange(currentPage) {
      this.$emit("handleCurrentChange", currentPage);
    }
  },
  watch: {}
};
</script>

<style scoped>
.page {
  /* margin-top: 20px; */
  padding-top: 20px;
  /* width: 100%; */
  background: #fff;
  text-align: right;
  overflow: hidden;
  /* position: absolute;
  bottom: 29px;
  right: 33px; */
  height: 15px;
}
.el-col {
  margin-top: -21px;
}
</style>
