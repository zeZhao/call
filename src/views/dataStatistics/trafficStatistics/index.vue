<template>
<!-- 技能组话务统计 -->
  <div class="trafficStatistics">
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
      <el-table-column prop="createTime" label="日期" >
        <template slot-scope="{row}">
          <span>{{row.createTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="skillGroupName" label="技能组" />
      <el-table-column prop="transferSeatNum" label="转坐席数" />
      <el-table-column prop="seatConnectionNum" label="坐席接通数" />
      <el-table-column prop="seatConnectionRate" label="坐席接通率" />
      <el-table-column prop="seat15ConnectionNum" label="15S接通数" />
      <el-table-column prop="seat15ConnectionRate" label="15S接通率" />
      <el-table-column prop="serviceDuration" label="服务总时长" />
      <el-table-column prop="callinDurationAvg" label="呼入平均时长" />
      <!-- <el-table-column prop="queueDurationAvg" label="平均排队时间" /> -->
      <el-table-column prop="ringDurationAvg" label="平均振铃时间" />
      <el-table-column prop="participateCommentsRate" label="参评率" />
      <el-table-column prop="satisfiedRate" label="满意率" />
      <el-table-column prop="calloutNum" label="呼出总数" />
      <el-table-column prop="calloutConnectionNum" label="呼出接通数" />
      <el-table-column prop="calloutConnectionRate" label="呼出接通率" />
      <el-table-column prop="calloutTotalDuration" label="呼出总时长" />
      <el-table-column prop="calloutDurationAvg" label="呼出平均时长" />
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
        { type: "input", label: "技能组", key: "skillGroupName" },
        // { type: "input", label: "被叫", key: "calledId" },
        // { type: "input", label: "坐席姓名", key: "attendName" },
        // { type: "input", label: "通话时长>", key: "talkDuration" },
        // { type: "input", label: "挂断方", key: "hungUpPerson" },
        // { type: "select", label: "呼叫结果", key: "isConnected", optionData:[{key:'0',value:"失败"},{key:1,value:'成功'}] },        
        // // { type: "datetime", label: "开始时间", key: "startTime" },
        // // { type: "datetime", label: "终止时间", key: "endTime" },
        { type: "datetime", label: "呼叫时间", key: ["","startTime","endTime"] },
      ],
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "dataStatistics",
        list: "skillsGroupStatisList", 
      },
      // isParamsNotData: false,-------------                                                                                                                                       
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
