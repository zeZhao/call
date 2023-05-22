<template>
<!-- 分时话务分析 -->
  <div class="trafficAnalyse">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <!-- <el-table-column label="序号" type="index" align="center" /> -->
      <!-- <el-table-column prop="corpName" label="企业名称" /> -->
      <el-table-column prop="periodTime" width="150" label="时段" >
        <template slot-scope="{row}">
          <span>{{row.periodTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="callinNum" label="呼入总数" />
      <el-table-column prop="transferSeatNum" label="转坐席数" />
      <el-table-column prop="seatConnectionNum" label="坐席接通数" />
      <el-table-column prop="seatConnectionRate" label="坐席接通率" />
      <el-table-column prop="seat15ConnectionNum" label="15s接通数" />
      <el-table-column prop="seat15ConnectionRate" label="15s接通率" />
      <el-table-column prop="callinDuration" label="呼入时长" />
      <el-table-column prop="callinDurationAvg" label="呼入平均时长" />
      <el-table-column prop="calloutNum" label="呼出总数" />
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
        // { type: "select", label: "企业ID", key: "corpId", optionData:[] },
        { type: "datetime", label: "呼叫时间", key: ["","startTime","endTime"] },
      ],
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "dataStatistics",
        list: "timeSharingList", 
      },
      isParamsNotData: false,
      submitParamsIsData: false,
      // 列表参数
      namespace: "",
      namespaceType: "Array",
    };
  },
  created() {},
  mounted() {
    // this.queryCorpByCorpType()
  },
  activated(){
    // this.queryCorpByCorpType()
  },
  computed: {},
  methods: {
    //获取公司下拉
    // corpType（0:商家,1:代理商,2:供应商）
    queryCorpByCorpType(corpType) {
      this.$http.select.queryCorpByCorpType({ corpType: "0" }).then((res) => {
        this._setDefaultValue(
          this.searchFormConfig,
          res.data.records,
          "corpId",
          "corpId",
          "corpName"
        );
      });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
</style>
