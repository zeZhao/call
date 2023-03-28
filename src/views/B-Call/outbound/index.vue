<template>
  <div class="company">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <!-- <el-table-column label="序号" type="index" align="center" /> -->
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="taskName" label="任务名称" />
      <el-table-column prop="taskType" label="任务类型" >
        <template slot-scope="{row}">
          <span v-if="row.taskType === 1">自动语音</span>
          <span v-if="row.taskType === 2">呼通后转人工</span>
        </template>
      </el-table-column>
      <el-table-column prop="sceneName" label="服务流程/班组" />
      <el-table-column prop="extName" label="主叫/线路" />
      <el-table-column prop="concurrency" label="并发上限" />
      <el-table-column prop="callNum" label="总号码数" />
      <el-table-column prop="surplusCallNum" label="剩余号码数" />
      <el-table-column prop="state" label="任务状态" >
        <template slot-scope="{row}">
          <span v-if="row.state === 3">未开始</span>
          <span v-if="row.state === 4">呼叫中</span>
          <span v-if="row.state === 5">自动暂停</span>
          <span v-if="row.state === 6">任务完成</span>
          <span v-if="row.state === 7">任务终止</span>
          <span v-if="row.state === 8">手动暂停</span>
        </template>
      </el-table-column>
      <el-table-column prop="corpId" label="更新时间" />
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >启动</el-button
          >
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >暂停</el-button
          >
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >追加</el-button
          >
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        :isSubmitBtn="true"
      >
      <template v-slot:custom = 'formData'>
        <el-form-item label="有效时段1：">
          <el-select v-model="formData.formData.timeValidity1_1" multiple collapse-tags>
            <el-option :value="1" label="星期一"></el-option>
            <el-option :value="2" label="星期二"></el-option>
            <el-option :value="3" label="星期三"></el-option>
          </el-select>
          <el-time-picker
            v-model="formData.formData.timeValidity1_2"
            style="width:120px;margin-left:20px"
            placeholder="任意时间点">
          </el-time-picker>
          <el-time-picker
            style="width:120px;margin-left:20px"  
            v-model="formData.formData.timeValidity1_3"
            placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="有效时段2：">
          <el-select v-model="formData.formData.timeValidity2_1" multiple collapse-tags>
            <el-option :value="1" label="星期一"></el-option>
            <el-option :value="2" label="星期二"></el-option>
            <el-option :value="3" label="星期三"></el-option>
          </el-select>
          <el-time-picker
            v-model="formData.formData.timeValidity2_2"
            style="width:120px;margin-left:20px"
            placeholder="任意时间点">
          </el-time-picker>
          <el-time-picker
            style="width:120px;margin-left:20px"  
            v-model="formData.formData.timeValidity2_3"
            placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>
      </template>
      </FormItem>
      
    </el-dialog>
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
        { type: "input", label: "商户名称", key: "corpId" },
        { type: "input", label: "任务名称", key: "taskName" },
        { type: "inputNum", label: "主叫号码", key: "extId" },
        {
          type: "select",
          label: "任务类型",
          key: "taskType",
          optionData: [
            { key: 1, value: "自动语音" },
            { key: 2, value: "呼通后转人工" },
          ],
        },
        {
          type: "select",
          label: "任务状态",
          key: "state",
          optionData: [
            { key: 3, value: "未开始" },
            { key: 4, value: "呼叫中" },
            { key: 5, value: "自动暂停" },
            { key: 6, value: "任务完成" },
            { key: 7, value: "任务终止" },
            { key: 8, value: "手动暂停" },
          ],
        },
        // {
        //   type: "select",
        //   label: "类别",
        //   key: "signs",
        //   optionData: [
        //     { key: "1", value: "商家" },
        //     { key: "2", value: "代理商" },
        //     { key: "3", value: "供应商" },
        //   ],
        // },
        // {
        //   type: "daterange",
        //   label: "开户时间",
        //   key: ["", "submitStartTime", "submitEndTime"],
        // },
      ],
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "smslongnum",
        list: "list",
        detele: "delete",
      },
      // 列表参数
      namespace: "",
      namespaceType: "Array",
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "商户名称",
          key: "corpId",
          defaultValue: "",
          optionData:[]
        },
        {
          type: "input",
          label: "任务名称",
          key: "taskName",
          defaultValue: "",
        },
        {
          type:"select",
          label:'任务类型',
          key:"taskType",
          colSpan:12,
          optionData:[
            { key: 1, value: "自动语音" },
            { key: 2, value: "呼通后转人工" },
          ]
        },
        {
          type:"select",
          label:'主叫/线路',
          key:"extId",
          colSpan:12,
          optionData:[
            { key: 1, value: "自动语音" },
            { key: 2, value: "呼通后转人工" },
          ]
        },
        {
          type:"select",
          label:'服务流程/班组',
          key:"sceneId",
          colSpan:12,
          optionData:[
            { key: 1, value: "自动语音" },
            { key: 2, value: "呼通后转人工" },
          ]
        },
        {
          type:"input",
          label:'并发数',
          key:"concurrency",
          colSpan:12,
        },
        {
          type:"uploadXlsx",
          label:'外呼号码',
          key:"extId",
          // colSpan:12,
        },
        // {
        //   type: "textarea",
        //   label: "长号码",
        //   key: "smsLongNum",
        //   defaultValue: "",
        //   maxlength: 4000,
        //   // rules: [
        //   //   {
        //   //     required: true,
        //   //     message: "请输入必填项",
        //   //     trigger: ['blur', 'change']
        //   //   }
        //   // ]
        // },
      ],
      id: "",
    };
  },
  created() {},
  mounted() {
    this.getUser()
  },
  activated(){
    this.getUser()
  },
  computed: {},
  methods: {
    //获取商家公司下拉
    getUser(){
      this.$http.select.queryCorpByCorpType({corpType:0}).then(res=>{
        this._setDefaultValue(this.formConfig,res.data.records,'corpId','corpId','corpName')
      })
    },
    _mxHandleSubmit(form){
      console.log(form,'----')
    }
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
