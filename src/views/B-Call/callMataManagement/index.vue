<template>
  <div class="company">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    >
    <template v-slot:other="form">
      <el-button type="primary" @click="exportExecl(form)">导出Execl</el-button>
    </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column label="序号" type="index" align="center" />
      <!-- <el-table-column prop="corpName" label="公司名称" /> -->
      <el-table-column prop="taskName" label="任务标题" />
      <el-table-column prop="startTime" label="开始时间" >
        <template slot-scope="{row}">
          <span>{{row.startTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="终止时间" >
        <template slot-scope="{row}">
          <span>{{row.endTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="外呼号码" />
      <el-table-column prop="talkDuration" label="通话时长" />
      <el-table-column prop="isConnected" label="呼叫状态" >
        <template slot-scope="{row}">
          <span v-if="row.isConnected == 0">未接通</span>
          <span v-else-if="row.isConnected == 1">接通</span>
          <span v-else>未开始</span>
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  components: {},
  data() {
    return {
      // 搜索框配置
      searchFormConfig: [
        { type: "input", label: "任务名称", key: "taskName" },
        { type: "input", label: "外呼号码", key: "mobile" },
        {
          type: "select",
          label: "呼叫状态",
          key: "isConnected",
          optionData: [
            { key: "0", value: "未接通" },
            { key: "1", value: "接通" },
            { key: "", value: "未开始" },
          ],
        },
        { type: "input", label: "通话时长>", key: "talkDuration" },
        { type: "date", label: "导入开始时间", key: "startTime" },
        { type: "date", label: "导入终止时间", key: "endTime" },
        // {
        //   type: "select",
        //   label: "签名",
        //   key: "sign",
        //   optionData: [
        //     { key: "1", value: "有效" },
        //     { key: "2", value: "无效" },
        //   ],
        // },
      ],
      isParamsNotData: false,
      submitParamsIsData: false,
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "outboundata",
        list: "list",
      },
      // 列表参数
      namespace: "",
      namespaceType: "Array",
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    exportExecl(form){
      console.log(form,'========')
      // this.$http.outboundata.export(this.searchParam).then(res=>{

      // })
    }
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
