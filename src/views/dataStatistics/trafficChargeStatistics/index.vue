<template>
<!-- 话务费用统计 -->
  <div class="trafficChargeStatistics">
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
      <el-table-column prop="connTime" label="日期" >
        <template slot-scope="{row}">
          <span>{{row.connTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="attendName" label="企业名称" />
      <el-table-column prop="jobNumber" label="呼入数" />
      <el-table-column prop="callerId" label="呼入时长" />
      <el-table-column prop="calledId" label="呼入费用" />
      <el-table-column prop="calledId" label="坐席呼出" />
      <el-table-column prop="calledId" label="坐席呼出时长" />
      <el-table-column prop="calledId" label="坐席呼出费用" />
      <el-table-column prop="calledId" label="自动呼出数" />
      <el-table-column prop="calledId" label="自动呼出时长" />
      <el-table-column prop="calledId" label="自动呼出费用" />
      <el-table-column prop="calledId" label="呼出总时长" />
      <el-table-column prop="calledId" label="总费用" />
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
        { type: "select", label: "企业ID", key: "corpId", optionData:[] },
        { type: "input", label: "主叫", key: "callerId" },
        { type: "input", label: "被叫", key: "calledId" },
        { type: "input", label: "坐席姓名", key: "attendName" },
        { type: "input", label: "通话时长>", key: "talkDuration" },
        { type: "input", label: "挂断方", key: "hungUpPerson" },
        { type: "select", label: "呼叫结果", key: "isConnected", optionData:[{key:'0',value:"失败"},{key:1,value:'成功'}] },        
        { type: "datetime", label: "呼叫时间", key: ["","callStartTime","callEndTime"] },
      ],
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "dataquery",
        list: "attendLogList", 
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
    this.queryCorpByCorpType()
  },
  activated(){
    this.queryCorpByCorpType()
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
