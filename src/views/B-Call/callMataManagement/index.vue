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
      <el-table-column prop="isConnected" label="呼叫状态" />
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
        { type: "input", label: "公司名称", key: "corpName" },
        { type: "input", label: "联系人", key: "corpNames" },
        { type: "inputNum", label: "联系电话", key: "userId" },
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
      namespace: "configs",
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
