<template>
  <div class="layout">
    <NavMenu></NavMenu>
    <div class="content">
      <div class="content_side">
        <Sidebar></Sidebar>
      </div>
      <div class="content_cnt">
        <Tags></Tags>
        <div class="content_page" id="content_page">
          <router-view />
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import NavMenu from "./components/NavMenu/index.vue";
import Sidebar from "./components/Sidebar";
import Tags from "./components/Tags";
export default {
  components: { NavMenu, Sidebar,Tags },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100vh;
  .content {
    background: #F0F2F5;
    position: relative;
    height: calc(100vh - 80px);
    overflow-y: auto;
    // min-height: 100%;
    .content_side {
      width: 175px;
      height: calc(100vh - 80px);
      float: left;
      position: fixed;
    }
    .content_cnt {
      // min-height: 100%;
      min-height: calc(100vh - 170px);
      margin-left: 175px;
      position: relative;
      padding: 16px;
      background: #F0F2F5;
      padding: 16px 24px;
      .content_page {
        min-height: calc(100vh - 175px);
        background: #fff;
        margin-top: 10px;
        padding: 10px 20px;
      }

      // ::v-deep .el-button {
      //   // min-width: 92px;
      //   height: 32px;
      //   padding: 7px 20px;
      // }
      ::v-deep .el-button--primary {
        background-color: #1890ff;
        border-color: #1890ff;
      }
      ::v-deep .el-form-item__content {
        line-height: 32px;
      }
      ::v-deep .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
      ::v-deep .el-form-item__label {
        padding: 0 !important;
        line-height: 34px !important;
      }
      ::v-deep .el-input__icon {
        height: auto;
        line-height: 32px;
      }
      ::v-deep .el-date-editor .el-range-separator {
        height: auto;
      }
      /* element-ui 表格样式修改 */
      .el-table--mini {
        font-size: 14px;
      }
      .el-table__body-wrapper {
        &::-webkit-scrollbar-track-piece {
          background: #d3dce6;
        }

        // &::-webkit-scrollbar {
        //   height: 16px;
        // }

        &::-webkit-scrollbar-thumb {
          background: #99a9bf;
          border-radius: 20px;
        }
      }
      .el-table {
        // height: auto;
        // overflow-y: auto;
        font-size: 12px;
        margin-bottom: 10px;
        // overflow-y: hidden;
      }
      .el-table__fixed-right {
        height: 100% !important;
        box-shadow: 3px 0px 10px 7px rgba(216, 216, 216, 0.7);
      }
      .el-table:not(.el-table--scrollable-x) {
        .el-table__fixed-right {
          height: 100% !important;
        }
      }
      .el-table--medium th,
      .el-table--medium td {
        padding: 0 !important;
        color: #303133 !important;
      }
      .el-table .cell {
        line-height: 16px;
      }
      ::v-deep .el-table--medium th {
        min-height: 32px;
        height: 32px;
        line-height: 16px;
      }
      ::v-deep .el-table .cell.el-tooltip {
        height: 25px !important;
        line-height: 25px !important;
      }

      .el-table .el-table__header-wrapper th {
        background: rgba(0, 0, 0, 0.02);
      }
      .el-table th.is-leaf {
        background: rgba(0, 0, 0, 0.02);
      }

      /* 表单 */
      ::v-deep .el-form-item--medium .el-form-item__label {
        line-height: 32px !important;
      }
      ::v-deep .el-form-item__label {
        height: 28px;
        font-size: 12px;
        font-weight: normal;
        padding-top: 2px;
      }
      ::v-deep .el-button {
        height: 28px;
        font-size: 12px;
        padding: 0 16px;
      }
      ::v-deep .cell .el-button {
        padding: 0 0px;
      }
      ::v-deep .el-input__inner {
        height: 28px !important;
        line-height: 28px !important;
        font-size: 12px;
        padding: 0 8px;
      }
      ::v-deep .el-input-number--medium {
        line-height: 26px;
      }
      ::v-deep .el-date-editor .el-input__inner {
        padding: 0 30px;
      }
    }
  }
}
</style>
