<template>
  <!-- 分机 -->
  <div class="extension">
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
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column prop="userName" label="商家账户" />
      <el-table-column prop="ext" label="分机号" />
      <el-table-column prop="pwd" label="分机密码" />
      <el-table-column prop="extType" label="分机类型" >
        <template slot-scope="{row}">
          <span v-if="row.status == 0">网页电话</span>
          <span v-if="row.status == 1">SIP话机</span>
        </template>
      </el-table-column>
      <el-table-column prop="attendName" label="绑定座席" />
      <el-table-column prop="caller" label="外呼主叫" />
      <el-table-column prop="lineId" label="外呼线路" />
      <el-table-column prop="extName" label="分机昵称" />
      <el-table-column prop="isBatchcaller" label="作为批量外呼主叫" />
      <el-table-column prop="isRecording" label="是否录音">
        <template slot-scope="{row}">
          <span v-if="row.status == 0">否</span>
          <span v-if="row.status == 1">是</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" >
        <template slot-scope="{row}">
          <span v-if="row.status == 0">禁用</span>
          <span v-if="row.status == 1">启用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'extId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="
              _mxDeleteItem('extId', scope.row.extId, false, false)
            "
            type="text"
            size="small"
            >删除
          </el-button>
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
        @onChange="onChange"
      ></FormItem>
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
        { type: "input", label: "商家账号", key: "userName" },
        { type: "input", label: "分机号", key: "ext" },
        {
          type: "select",
          label: "分机类型",
          key: "extType",
          optionData: [
            { key: 1, value: "SIP话机" },
            { key: 0, value: "网页电话" },
          ],
        },
        {
          type: "select",
          label: "外呼线路",
          key: "lineId",
          optionData: [
          ],
        },
        {
          type: "select",
          label: "状态",
          key: "status",
          optionData: [
            { key: 1, value: "启用" },
            { key: 0, value: "禁用" },
          ],
        },
        {
          type: "select",
          label: "是否录音",
          key: "isRecording",
          optionData: [
            { key: 1, value: "是" },
            { key: 0, value: "否" },
          ],
        },
        {
          type: "select",
          label: "绑定座席",
          key: "attendId",
          optionData: [
          ],
        },
      ],
      isParamsNotData: false,
      submitParamsIsData: false,
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "extensions",
        list: "list",
        add: "saveExtensions",
        edit: "updateExtensions",
        detele: "delete",
      },
      // 列表参数
      namespace: "",
      namespaceType: "Array",
      id: "",
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "商家名称",
          key: "userId",
          defaultValue: "",
          optionData:[]
        },
        {
          type: "input",
          label: "分机数",
          key: "extNum",
          defaultValue: "",
        },
        
        {
          type: "radio",
          label: "分机密码类型",
          key: "pwdType",
          defaultValue: 1,
          optionData:[
            { key: 1, value: "随机生成" },
            { key: 2, value: "指定密码" },
          ]
        },
        {
          type: "input",
          label: "分机号",
          key: "ext",
          isShow:true,
          defaultValue: "",
        },
        {
          type: "input",
          label: "密码",
          key: "pwd",
          isShow:true,
          rules:[],
          defaultValue: "",
        },
        {
          type: "select",
          label: "分机类型",
          key: "extType",
          defaultValue: "",
          optionData:[
            { key: 1, value: "sip电话" },
            { key: 0, value: "web电话" },
          ],
          colSpan:12
        },
        {
          type: "select",
          label: "状态",
          key: "status",
          optionData: [
            { key: 1, value: "启用" },
            { key: 0, value: "禁用" },
          ],
          colSpan:12
        },
        {
          type: "select",
          label: "是否录音",
          key: "isRecording",
          defaultValue: "",
          optionData:[
            { key: 1, value: "是" },
            { key: 0, value: "否" },
          ],
          colSpan:12
        },
        {
          type: "select",
          label: "外呼线路",
          key: "lineId",
          defaultValue: "",
          optionData:[
          ],
          colSpan:12
        },
        {
          type: "input",
          label: "外呼主叫",
          key: "caller",
          defaultValue: "",
          rules:[],
          colSpan:12
        },
        {
          type: "select",
          label: "绑定坐席",
          key: "attendId",
          defaultValue: "",
          optionData:[
          ],
          rules:[],
          colSpan:12
        },
        {
          type: "checkbox",
          label: "",
          key: "isBatchcaller",
          defaultValue: "",
          rules:[],
          optionData:[
            { key: 1, value: "作为批量外呼主叫" },
          ],
          colSpan:12
        },
        {
          type: "checkbox",
          label: "",
          key: "autogeneration",
          defaultValue: "",
          rules:[],
          optionData:[
            { key: 1, value: "自动生成并绑定座席" },
          ],
          colSpan:12
        },
        {
          type: "input",
          label: "主叫昵称",
          key: "extName",
          defaultValue: "",
          isShow:true,
          rules:[],
          colSpan:12
        },
        
        {
          type: "input",
          label: "座席起始工号",
          key: "jobNumberStart",
          defaultValue: "",
          isShow:true,
          rules:[],
          colSpan:12
        },
      ],
    };
  },
  created() {},
  mounted() {
    this.queryCorpByCorpType()
    this.linecfgList()
    this.listAllAttend()
  },
  activated(){
    this.queryCorpByCorpType()
    this.linecfgList()
    this.listAllAttend()
  },
  computed: {},
  methods: {
    //获取公司下拉
    queryCorpByCorpType(){
      this.$http.select.userListAll({}).then(res=>{
        this._setDefaultValue(this.formConfig,res.data.records,'userId','userId','userName')
      })
    },
    //获取线路下拉
    linecfgList(){
      this.$http.linecfg.get({enablePage:false}).then(res=>{
        this._setDefaultValue(this.formConfig,res.data.list,'lineId','lineId','lineName')
        this._setDefaultValue(this.searchFormConfig,res.data.list,'lineId','lineId','lineName')
      })
    },
    //获取坐席下拉
    listAllAttend(){
      this.$http.select.attendlistAll().then(res=>{
        this._setDefaultValue(this.formConfig,res.data,'attendId','attendId','attendName','state')
        this._setDefaultValue(this.searchFormConfig,res.data,'attendId','attendId','attendName')
      })
    },
    _mxCreate(){
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
        this._setDisplayShow(this.formConfig,'pwd',true)
        this._setDisplayShow(this.formConfig,'extName',true)
        this._setDisplayShow(this.formConfig,'jobNumberStart',true)
        this._setDisplayShow(this.formConfig,'status',true)
        this._setDisplayShow(this.formConfig,'ext',true)
        this._setDisplayShow(this.formConfig,'attendId',true)
        this._setDisplayShow(this.formConfig,'isBatchcaller',false)
        this._setDisplayShow(this.formConfig,'autogeneration',false)
        this._setDisplayShow(this.formConfig,'extNum',false)
        this._setDisplayShow(this.formConfig,'pwdType',false)
      }, 0);
    },
    _mxEdit(row, ID) {
      this.listAllAttend()
      row = this._mxArrangeEditData(row);
      this.id = row[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      this._setDisplayShow(this.formConfig,'extNum',true)
      this._setDisplayShow(this.formConfig,'pwdType',true)
      this._setDisplayShow(this.formConfig,'autogeneration',true)
      this._setDisplayShow(this.formConfig,'jobNumberStart',true)
      this._setDisplayShow(this.formConfig,'isBatchcaller',true)
      this._setDisplayShow(this.formConfig,'pwd',false)
      this._setDisplayShow(this.formConfig,'status',false)
      this._setDisplayShow(this.formConfig,'ext',false)
      this._setDisplayShow(this.formConfig,'extName',false)
      this._setDisplayShow(this.formConfig,'attendId',false)
      
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    onChange({val,item}){
      const {key } = item 
      if( key === 'pwdType'){
        if(val == 2){
          this._setDisplayShow(this.formConfig,'pwd',false)
        }else{
          this._setDisplayShow(this.formConfig,'pwd',true)
        }
      }
      if( key === 'isBatchcaller'){
        if(val == 1){
          this._setDisplayShow(this.formConfig,'extName',false)
        }else{
          this._setDisplayShow(this.formConfig,'extName',true)
        }
      }
      if( key === 'autogeneration'){
        if(val == 1){
          this._setDisplayShow(this.formConfig,'jobNumberStart',false)
        }else{
          this._setDisplayShow(this.formConfig,'jobNumberStart',true)
        }
      }
    },
    _mxArrangeSubmitData(formData){
      let form = Object.assign({},formData)
      form.isBatchcaller = formData.isBatchcaller[0]
      return form
    }
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
