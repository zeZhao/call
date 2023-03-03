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
      <el-table-column prop="skillGroupName" label="技能组名称" />
      <!-- <el-table-column prop="ivrId" label="技能组流程" >
        <template slot-scope="{row}">
          <span v-if="row.taskType === 1">自动语音</span>
          <span v-if="row.taskType === 2">呼通后转人工</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="attendCount" label="座席数量" />
      <el-table-column prop="attendPolicy" label="座席分配策略">
        <template slot-scope="{ row }">
          <span v-if="row.attendPolicy === 0">随机</span>
          <span v-if="row.attendPolicy === 1">轮选</span>
          <span v-if="row.attendPolicy === 2">共振</span>
          <span v-if="row.attendPolicy === 3">分机记忆</span>
          <span v-if="row.attendPolicy === 4">空闲时间最长</span>
          <span v-if="row.attendPolicy === 5">通话时长最短</span>
          <span v-if="row.attendPolicy === 6">电话数最少</span>
        </template>
      </el-table-column>
      <el-table-column prop="sceneName" label="满意度流程" />
      <el-table-column prop="isJobnumber" label="报工号">
        <template slot-scope="{ row }">
          <span v-if="row.isJobnumber === 0">否</span>
          <span v-if="row.isJobnumber === 1">是</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="jnSoundId" label="报工号语音" /> -->
      <el-table-column prop="status" label="状态">
        <template slot-scope="{ row }">
          <span v-if="row.status === 0">禁用</span>
          <span v-if="row.status === 1">启用</span>
          <!-- <span v-if="row.state === 3">未开始</span>
          <span v-if="row.state === 4">呼叫中</span>
          <span v-if="row.state === 5">自动暂停</span>
          <span v-if="row.state === 6">任务完成</span>
          <span v-if="row.state === 7">任务终止</span>
          <span v-if="row.state === 8">手动暂停</span> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button
            @click="_mxEdit(scope.row, 'sgId')"
            type="text"
            size="small"
            >查看</el-button
          > -->
          <el-button
            @click="_mxEdit(scope.row, 'sgId')"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button
            @click="_mxDeleteItem('sgId', scope.row.sgId, false, false)"
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
        @selectChange="selectChange"
        :isSubmitBtn="true"
      >
        <!-- <template v-slot:custom="{ formData }">
          <div style="margin-left: 50px; margin-bottom: 20px">
            
          </div>
        </template> -->
      </FormItem>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
import { setStorage, getStorage } from "@/utils/auth";
export default {
  mixins: [listMixin],
  components: {},
  data() {
    return {
      transferData: [],
      leftDefaultCheckedList: [],
      rightDefaultCheckedList: [],
      // 搜索框配置
      searchFormConfig: [
        // { type: "input", label: "商户名称", key: "corpId" },
        { type: "input", label: "技能组流程", key: "taskName" },
        { type: "input", label: "满意度流程", key: "extId" },
        { type: "input", label: "技能组名称", key: "extId" },
        {
          type: "select",
          label: "座席分配策略",
          key: "taskType",
          optionData: [
            { key: 0, value: "随机" },
            { key: 1, value: "轮选" },
            { key: 2, value: "共振" },
            { key: 3, value: "分机记忆" },
            { key: 4, value: "空闲时间最长" },
            { key: 5, value: "通话时间最短" },
            { key: 6, value: "电话数量最少" },
          ],
        },
        {
          type: "select",
          label: "状态",
          key: "state",
          optionData: [
            { key: 3, value: "有效" },
            { key: 4, value: "停用" },
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
        namespace: "skillGroup",
        list: "listByPage",
        detele: "delete",
        add: "save",
        edit: "update",
      },
      isParamsNotData: false,
      submitParamsIsData: false,
      // 列表参数
      namespace: "",
      namespaceType: "Array",
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "商户名称",
          key: "corpId",
          defaultValue: "",
          isShow:true,
        },
        {
          type: "input",
          label: "技能组名称",
          key: "skillGroupName",
          defaultValue: "",
        },
        // {
        //   type:"select",
        //   label:'排队流程',
        //   key:"taskType",
        //   colSpan:12,
        //   optionData:[
        //     { key: 1, value: "系统默认" },
        //     { key: 2, value: "呼通后转人工" },
        //   ]
        // },
        {
          type: "select",
          label: "座席分配策略",
          key: "attendPolicy",
          colSpan: 12,
          optionData: [
            { key: 0, value: "随机" },
            { key: 1, value: "轮选" },
            { key: 2, value: "共振" },
            { key: 3, value: "分机记忆" },
            { key: 4, value: "空闲时间最长" },
            { key: 5, value: "通话时间最短" },
            { key: 6, value: "电话数量最少" },
          ],
        },
        {
          type: "select",
          label: "满意度调查流程",
          key: "satisfactionIvrId",
          colSpan: 12,
          defaultValue: 1,
          optionData: [],
        },
        {
          type: "select",
          label: "是否报工号",
          key: "isJobnumber",
          colSpan: 12,
          defaultValue: 1,
          optionData: [{key:1,value:"是"},{key:0,value:"否"}],
        },
        {
          type: "select",
          label: "状态",
          key: "status",
          colSpan: 12,
          defaultValue: 1,
          optionData: [{key:1,value:"启用"},{key:0,value:"禁用"}],
        },
        {
          type: "divider",
        },
        {
          type: "transfer",
          label: "",
          key: "attendIdList",
          data: [],
          defaultValue: [],
          titles: ["待关联座席", "已关联座席"],
          leftDefaultCheckedList: this.leftDefaultCheckedList,
          rightDefaultCheckedList: this.rightDefaultCheckedList,
          rules: [],
        },
      ],
      id: "",
      //技能组列表
      skillGroupList: [],
      //企业坐席
      attendAllList: [],
      //技能组坐席
      attendSkillGroupList: [],
      //流程数据
      sceneList: [],
    };
  },
  created() {},
  mounted() {
    // this.queryCorpByCorpType();
  },
  computed: {},
  methods: {
    // 获取场景 、 线路
    listScene(corpId) {
      var data = {
        data: {
          corpId,
        },
        version: "1.0",
      };
      this.$http.outbound.listScene(data).then((res) => {
        if (res.state === "0000") {
          this.sceneList = res.data;
          this._setDefaultValue(
            this.formConfig,
            res.data,
            "satisfactionIvrId",
            "sceneId",
            "sceneName"
          );
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 获取技能组列表
    // getlistAll() {
    //   this.$http.skillGroup.listAll().then((res) => {
    //     console.log(res);
    //   });
    // },


    //设置穿梭框数据
    setAttendIdList(data) {
      this.formConfig.forEach((item) => {
        if (item.key === "attendIdList")
          this.$nextTick(() => {
            this.$set(item, "data", data);
          });
      });
    },
    // 获取本企业所有坐席
    async getListAttendAll(corpId) {
      await this.$http.skillGroup.listAttendAll({ corpId }).then((res) => {
        if (resOk(res)) {
          let arr = [];
          let checkList = [];
          res.data.forEach((item) => {
            if (item.state != 1) {
              arr.push({
                key: item.attendId,
                label: item.attendName,
                disabled: item.state == 1 ? true : false,
              });
            }
          });
          this.attendSkillGroupList.forEach((item) => {
            arr.push({
              key: item.attendId,
              label: item.attendName,
              disabled: item.state == 1 ? true : false,
            });
            checkList.push(item.attendId);
          });
          console.log(arr, "=========获取本企业所有坐席");
          console.log(checkList, "=========技能组所有坐席");
          this.setAttendIdList(arr)
          this._setDefaultValue(this.formConfig, [], "attendIdList", checkList);
        }
        // console.log(res);
      });
    },
    // 获取本技能组所有坐席
    async getListAttendAllBySkillGroup(sgId) {
      this.attendSkillGroupList = []
      await this.$http.skillGroup
        .listAttendAllBySkillGroup({ sgId })
        .then((res) => {
          if (resOk(res)) {
            this.attendSkillGroupList = res.data;
          }
          // console.log(res);
        });
    },
    selectChange({ val, item }) {
      if (item.key === "corpId") {
        if (val) {
          this.listScene(val);
          this.getListAttendAll(val);
          this._deleteDefaultValue(this.formConfig, "satisfactionIvrId");
        } else {
          this._setDefaultValue(
            this.formConfig,
            [],
            "satisfactionIvrId",
            "sceneId",
            "sceneName"
          );
          this._deleteDefaultValue(this.formConfig, "satisfactionIvrId");
        }
      }
    },



     /**
     * 创建表单
     * @param row  当前行数据
     * @param id  当前行ID
     * @private
     */

    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      let corpId = JSON.parse(getStorage("info")).corpId
      this._setDefaultValue(this.formConfig, [], "attendIdList", []);
      this.attendSkillGroupList = []
      this.getListAttendAll(corpId);
      this.listScene(corpId);
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    /**
     * 编辑表单
     * @param row  当前行数据
     * @param ID  当前行ID
     * @private
     */

    async _mxEdit(row, ID) {
      row = this._mxArrangeEditData(row);
      this.id = row[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.getListAttendAllBySkillGroup(row.sgId);
      await this.formConfig.forEach(async (item) => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "corpId") {
          await this.listScene(item.defaultValue);
          await this.getListAttendAll(item.defaultValue);
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);

      this.addChannel = true;
    },
    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    _mxArrangeSubmitData(formData) {
      let corpId = JSON.parse(getStorage("info")).corpId
      formData.corpId = corpId
      return formData;
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
