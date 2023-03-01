<style lang="scss" scoped>
.el-divider--horizontal {
  margin-top: 0;
}
</style>
<template>
  <div style="width: 100%">
    <div id="noteBox" v-if="$route.matched.length < 3">
      <div id="queryBox">
        <el-form :inline="true" class="demo-form-inline" size="small">
          <!-- <el-form-item label="商户名称：" v-if="!userType">
            <el-select
              v-model="quertForm.corpId"
              @change="queryListScene"
              clearable
              filterable
              placeholder="请选择场商户名称"
            >
              <el-option
                v-for="(item, index) in clientList"
                :label="item.corpName"
                :value="item.corpId"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="任务名称：" v-if="!userType">
            <el-select
              v-model="quertForm.sceneId"
              clearable
              placeholder="请选择场景名称"
            >
              <el-option
                v-for="(item, index) in querySceneData"
                :label="item.sceneName"
                :value="item.sceneId"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="任务名称：">
            <el-input
              v-model="quertForm.sceneId"
              clearable
              placeholder="请输入任务名称："
            ></el-input>
          </el-form-item>
          <el-form-item label="主叫号码：">
            <el-input
              v-model="quertForm.phone"
              clearable
              placeholder="请输入主叫号码"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="更新时间：">
            <el-date-picker
              size="small"
              :clearable="false"
              v-model="quertForm.startEndTime"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item> -->
          <!-- <el-form-item label="商户ID：" v-if="!userType">
            <el-input v-model="quertForm.corpId" clearable placeholder="请输入商户ID"></el-input>

          </el-form-item>
          <el-form-item label="场景ID：">
            <el-input v-model="quertForm.sceneId" clearable placeholder="请输入场景ID"></el-input>
          </el-form-item>-->
          <el-form-item label="任务类型">
            <el-select v-model="quertForm.status" clearable placeholder="请选择任务类型">
              <el-option label="自动语音" value="1"></el-option>
              <el-option label="呼通后转人工" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务状态：">
            <el-select v-model="quertForm.status" clearable placeholder="请选择任务状态">
              <el-option label="已停止" value="1"></el-option>
              <el-option label="运行中" value="0"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="场景名称：" v-if="!userType">
            <el-select v-model="quertForm.sceneId" clearable placeholder="请选择场景名称">
              <el-option
                v-for="(item,index) in  querySceneData"
                :label="item.sceneName"
                :value="item.sceneId"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>-->

          <el-form-item>
            <el-button type="primary" @click="List('query')">查询</el-button>
          </el-form-item>
          <el-button
            size="small "
            type="primary"
            @click="NewlyEdit"
            style="float: right; margin-right: 30px"
          >
            新增
            <i class="el-icon-plus"></i>
          </el-button>
        </el-form>
      </div>
      <div id="listBox">
        <!--任务编号 任务名称 被叫号码 商户名称 场景名称 任务状态 呼入数量 创建时间 操作-->
        <el-table
          v-loading="loading"
          ref="filterTable"
          :data="tableData"
          style="width: 100%"
          max-height="500"
          border
        >
          <el-table-column
            align="center"
            prop="corpName"
            label="商户名称"
            min-width="150"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="taskName"
            label="任务名称"
            min-width="70"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <!-- <el-table-column
            align="center"
            prop="state"
            label="任务类型"
            min-width="70"
            :show-overflow-tooltip="true"
          >
          <template slot-scope="{row}">
            <span v-if="row.state === 3">未开始</span>
            <span v-if="row.state === 4">呼叫中</span>
            <span v-if="row.state === 5">自动暂停</span>
            <span v-if="row.state === 6">任务完成</span>
            <span v-if="row.state === 7">任务终止</span>
            <span v-if="row.state === 8">手动暂停</span>
          </template>
          </el-table-column> -->
          <el-table-column
            align="center"
            prop="taskType"
            label="任务类型"
            min-width="70"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="{ row }">
              <span v-if="row.taskType === 1">自动语音</span>
              <span v-if="row.taskType === 2">呼通后转人工</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="sceneName"
            label="服务流程/班组"
            min-width="100"
            :show-overflow-tooltip="true"
          ></el-table-column>

          <el-table-column
            align="center"
            prop="extName"
            label="主叫/线路"
            min-width="80"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="concurrency"
            label="并发上限"
            min-width="80"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="callNum"
            label="总号码数"
            min-width="80"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="surplusCallNum"
            label="剩余号码数"
            min-width="80"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="status"
            label="任务状态"
            min-width="80"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="{ row }">
              <span v-if="row.status === 0">暂停</span>
              <span v-if="row.status === 1">启用</span>
              <span v-if="row.status === 2">已删除</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="updateTime"
            label="更新时间"
            min-width="80"
            :show-overflow-tooltip="true"
          ><template slot-scope="{row}">
          <span>{{row.updateTime | dateTime}}</span>
        </template>
      </el-table-column>
          <!-- <el-table-column
            align="center"
            prop="statusText"
            label="状态"
            min-width="60"
            :show-overflow-tooltip="true"
          ></el-table-column> -->
          <el-table-column align="center" label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-if="scope.row.status == 1 || scope.row.status == '1'"
                @click="status(scope.$index, scope.row, 0)"
                >禁用</el-button
              >
              <el-button
                type="text"
                size="small"
                v-if="scope.row.status == 0 || scope.row.status == '0'"
                @click="status(scope.$index, scope.row, 1)"
                >启用</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                @click="NewlyEdit(scope.$index, scope.row)"
                type="text"
                size="small"
                >编辑</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="text"
                size="small"
                @click="del(scope.$index, scope.row)"
                >删除</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="text"
                size="small"
                @click="ImportFile(scope.$index, scope.row)"
                >追加</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <!-- 分页 -->
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber"
          :current-page="page"
          style="float: right; margin-right: 30px"
          @current-change="pagingChange"
        ></el-pagination>
      </div>

      <!-- 新增弹框 -->
      <el-drawer
        :title="title"
        v-if="isNew"
        :visible.sync="isNew"
        size="60%"
        :destroy-on-close="true"
      >
        <div style="width: 100%; padding: 0 20px">
          <el-form
            ref="RuleForm"
            :rules="newRules"
            :inline="true"
            :model="RuleForm"
            label-position="left"
            label-width="110px"
            class="demo-form-inline"
            size="small"
          >
            <el-divider></el-divider>
            <!-- <el-form-item label="商户名称：" prop="corpId" v-if="!userType">
              <el-select
                v-model="RuleForm.corpId"
                clearable
                placeholder="请选择商户名称"
                style="width: 200px"
                @change="changeClient"
              >
                <el-option
                  v-for="(item, index) in clientList"
                  :label="item.corpName"
                  :value="item.corpId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="任务名称：" prop="taskName">
              <el-input
                v-model="RuleForm.taskName"
                placeholder="请输入任务名称"
              ></el-input>
            </el-form-item>

            <el-form-item label="任务类型：" prop="taskType">
              <el-select
                v-model="RuleForm.taskType"
                clearable
                placeholder="请选择任务类型"
                style="width: 200px"
              >
                <el-option label="自动语音" :value="1"></el-option>
                <el-option label="呼通后转人工" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主叫/线路：" prop="extId">
              <el-select
                v-model="RuleForm.extId"
                clearable
                placeholder="请选择主叫/线路"
                style="width: 200px"
              >
                <el-option
                  v-for="(item, index) in extList"
                  :label="item.extName"
                  :value="item.extId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="服务流程/班组："
              prop="sceneId"
              v-if="!userType"
            >
              <el-select
                v-model="RuleForm.sceneId"
                clearable
                placeholder="请选择服务流程/班组"
                style="width: 200px"
              >
                <!-- sceneList -->
                <el-option
                  v-for="(item, index) in sceneList"
                  :label="item.sceneName"
                  :value="item.sceneId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="并发数："  prop="concurrency">
              <el-input
                v-model="RuleForm.concurrency"
                placeholder="请输入并发数"
              ></el-input>
            </el-form-item>

            <el-form-item label="周天：" prop="weekDays">
              <el-checkbox-group v-model="RuleForm.weekDays">
                <el-checkbox label="1">星期一</el-checkbox>
                <el-checkbox label="2">星期二</el-checkbox>
                <el-checkbox label="3">星期三</el-checkbox>
                <el-checkbox label="4">星期四</el-checkbox>
                <el-checkbox label="5">星期五</el-checkbox>
                <el-checkbox label="6">星期六</el-checkbox>
                <el-checkbox label="0">星期天</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="日期：" prop="startDate">
              <el-date-picker
                v-model="RuleForm.startDate"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择开始日期">
              </el-date-picker>
              <span style="padding: 0 10px">至</span>
              <el-date-picker
                v-model="RuleForm.stopDate"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择结束日期">
              </el-date-picker>
              <!-- <el-date-picker
                v-model="RuleForm.startDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker> -->
            </el-form-item>
            {{ RuleForm.callTime1Star }}
            <el-form-item label="时间段1：" prop="callTime1Start">
              <el-time-picker
                style="width: 200px; margin-left: 10px"
                is-range
                v-model="RuleForm.callTime1Start"
                value-format="HH:mm:ss"
                format="HH:mm:ss"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              ></el-time-picker>
            </el-form-item>

            <el-form-item label="时间段2：" prop="callTime2Start">
              <el-time-picker
                style="width: 200px; margin-left: 10px"
                is-range
                value-format="HH:mm:ss"
                format="HH:mm:ss"
                v-model="RuleForm.callTime2Start"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              ></el-time-picker>
            </el-form-item>

            <el-form-item label="时间段3：" prop="callTime3Start">
              <el-time-picker
                style="width: 200px; margin-left: 10px"
                is-range
                value-format="HH:mm:ss"
                format="HH:mm:ss"
                v-model="RuleForm.callTime3Start"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              ></el-time-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="demo-drawer__footer">
          <el-button @click="isNew = false" size="small">取 消</el-button>
          <el-button
            type="primary"
            :loading="SubmitLoading"
            @click="mewSubmit('RuleForm')"
            size="small"
            >确 定</el-button
          >
        </div>
      </el-drawer>
      <!-- 导入弹框 -->
      <el-dialog title="导入数据" :visible.sync="isImport" width="40%">
        <div>
          <div class="downDiv">
            <h3>填写导入客户的信息</h3>
            <p style="margin-bottom: 10px">
              请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除
            </p>
            <el-button type="primary" size="mini" @click="ExDownload"
              >下载xls/xlsx模板</el-button
            >
            <el-button type="primary" size="mini" @click="PPTDownload"
              >下载csv模板</el-button
            >
          </div>

          <div class="downDiv">
            <h3>上传填好的客户信息表</h3>
            <p style="margin-bottom: 10px">
              文件后缀名必须为xls 或xlsx或csv ，xls
              、xlsx格式数据量≤2万，csv数据量≤20万
            </p>
            <el-upload
              class="upload-demo"
              action="/api/callTask/importCallData"
              :before-upload="beforeAvatarUpload"
              :data="curRecordUpload"
              :headers="header"
              :on-success="uploadSucess"
              :file-list="fileList"
              :on-error="uploadError"
              :on-change="exceed"
              ref="upload"
              :auto-upload="false"
            >
              <el-button type="primary" size="mini">上传文件</el-button>
            </el-upload>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isImport = false">取 消</el-button>
          <el-button type="primary" @click="submitUpload('upload')"
            >确定导入</el-button
          >
        </span>
      </el-dialog>
    </div>

    <router-view></router-view>
    <audio :src="audioUrl" ref="myAudio"></audio>
  </div>
</template>

<script>
import axios from "axios";
import { setStorage, getStorage } from "@/utils/auth";
export default {
  computed: {},
  data() {
    var self = this;

    // 商户账号验证
    var corpIdValidator = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("商户账号不能为空"));
      } else {
        if (this.RuleForm.corpId !== "") {
          setTimeout(() => {
            callback();
          }, 1000);
        }
      }
    };
    //被叫号码
    var inboundCallerIdValidator = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("并发数不能为空"));
      } else {
        if (this.numberTest(value) === true) {
          setTimeout(() => {
            callback();
          }, 1000);
        } else {
          return callback(new Error("请输入数字"));
        }
      }
    };
    //日期验证
    var startDateValidator = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("日期不能为空"));
      } else {
        if (this.RuleForm.startDate !== "" && this.RuleForm.stopDate !== "") {
          setTimeout(() => {
            callback();
          }, 1000);
        }
      }
    };
    //周天验证
    var weekDaysValidator = (rule, value, callback) => {
      if (value === "" || value.length == 0) {
        return callback(new Error("周天不能为空"));
      } else {
        if (this.RuleForm.weekDays !== "") {
          setTimeout(() => {
            callback();
          }, 1000);
        }
      }
    };
    //启用验证
    var callTime1StartValidator = (rule, value, callback) => {
      console.log(value);
      if (value === null || value === "") {
        return callback(new Error("时间段1不能为空"));
      } else {
        if (value != null) {
          setTimeout(() => {
            callback();
          }, 1000);
        }
      }
    };
    //呼叫次数验证
    // var maxCallCountValidator = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("呼叫次数不能为空"));
    //   } else {
    //     if (this.RuleForm.maxCallCount !== "") {
    //       setTimeout(() => {
    //         self.$refs.RuleForm.validateField("maxCallCount");
    //       }, 1000);
    //     }
    //     callback();
    //   }
    // };

    // AAECAea5AwSKB8y6A8O8A9rGAw26tgOLugOjuwPXuwPgvAO6xgPHxgPZxgPVyAP3yAP5yAP+yAOcyQMA
    return {
      loading: true,
      SubmitLoading: false,
      styleObj: {
        background: "#eeeeee",
        color: "black",
        padding: "15",
      },
      title: "",
      subInbound: "1",
      // 搜索条件
      quertForm: {
        sceneId: "",
        corpId: JSON.parse(getStorage('info')).corpId,
        campaignName: "",
        phone: "",
        status: "",
        startEndTime: [
          new Date(
            new Date(new Date().toLocaleDateString()).getTime() -
              24 * 60 * 60 * 1000 * 6
          ),
          new Date(
            new Date(new Date().toLocaleDateString()).getTime() +
              (24 * 60 * 60 * 1000 - 1)
          ),
        ],
      },
      tableData: [],
      querySceneData: [],
      // 新增 验证
      newRules: {
        corpId: [
          {
            required: true,
            validator: corpIdValidator,
            trigger: "change",
          },
        ],
        taskName: [
          {
            required: true,
            message: "任务名称不能为空",
            trigger: "blur",
          },
        ],
        taskType: [
          {
            required: true,
            message: "任务类型不能为空",
            trigger: "change",
          },
        ],
        extId: [
          {
            required: true,
            message: "主叫/线路不能为空",
            trigger: "blur",
          },
        ],
        concurrency: [
          {
            required: true,
            // message: "并发数不能为空",
            validator: inboundCallerIdValidator,
            trigger: "blur",
          },
        ],
        sceneId: [
          {
            required: true,
            message: "服务流程/班组不能为空",
            trigger: "change",
          },
        ],
        // taskName: [
        //   {
        //     required: true,
        //     validator: taskNameValidator,
        //     trigger: "change",
        //   },
        // ],
        // voiceFile: [
        //   {
        //     required: true,
        //   },
        // ],
        startDate: [
          {
            required: true,
            validator: startDateValidator,
            trigger: "change",
          },
        ],
        weekDays: [
          {
            required: true,
            validator: weekDaysValidator,
            trigger: "change",
          },
        ],
        callTime1Start: [
          {
            required: true,
            validator: callTime1StartValidator,
            trigger: "change",
          },
        ],
        // maxCallCount: [
        //   {
        //     required: true,
        //     validator: maxCallCountValidator,
        //     trigger: "blur"
        //   }
        // ],
        // asrEnable: [
        //   {
        //     required: true,
        //     validator: asrEnableValidator,
        //     trigger: "blur"
        //   }
        // ],
      },
      RuleForm: {
        corpId: JSON.parse(getStorage('info')).corpId, //商户id
        taskName: "", //任务名称
        taskType: "", // 任务类型
        extId: "", // 线路
        sceneId: "", // 流程、班组
        concurrency: "", // 并发数
        startDate: "", //开始日期
        stopDate: "",
        weekDays: [], //周天
        callTime1Start: "",
        callTime1End: "",
        callTime2Start: "",
        callTime2End: "",
        callTime3Start: "",
        callTime3End: "",
      },
      isNew: false, // 新增显示
      isImport: false, // 导入显示

      clientList: [], // 商户名称列表
      sceneList: [], // 班组列表
      extList: [], // 线路列表
      page: 1,
      size: 10,
      totalNumber: 10, //总页面
      week: [
        {
          label: "星期一",
          value: "1",
        },
        {
          label: "星期二",
          value: "2",
        },
        {
          label: "星期三",
          value: "3",
        },
        {
          label: "星期四",
          value: "4",
        },
        {
          label: "星期五",
          value: "5",
        },
        {
          label: "星期六",
          value: "6",
        },
        {
          label: "星期日 ",
          value: "0",
        },
      ],
      isDate: true,
      sunday: true,
      rowData: {},

      curRecordUpload: {
        taskId: "",
      },
      curInboundId: "",
      fileList: [],
      userType: "",
      hasAudio: false,
      audioUrl: "",
      header:{token:getStorage('token')}
    };
  },
  created() {
    this.List();
    // this.queryListScene()
    this.getExtList();
    this.listScene();
    // this.listClient();
    this.userType = false;
  },
  mounted() {},
  watch: {},

  components: {},

  computed: {
    info(){
      return JSON.parse(getStorage('info'))
    }
  },

  methods: {
    //选择商户change操作
    changeClient() {
      this.getExtList();
      this.listScene();
      this.RuleForm.sceneId = ''
      this.RuleForm.extId = ''
    },
    // 获取分机接口
    getExtList() {
      let data = {
        corpId: this.RuleForm.corpId,
      };
      console.log(data, "=====");
      this.$http.extensions.extensionsList(data).then((res) => {
        if (res.state === "0000") {
          this.extList = res.data;
          console.log(res);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 获取场景 、 线路
    listScene() {
      var data = {
        data: {
          corpId: this.RuleForm.corpId,
          processType: this.RuleForm.processType,
        },
        version: "1.0",
      };
      this.$http.outbound.listScene(data).then((res) => {
        if (res.state === "0000") {
          this.sceneList = res.data;
          console.log(res);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    /*

     新增 ,编辑
     */
    ImportFile(index, row) {
      this.isImport = true;
      this.rowData = row;
    },
    /*
   限制上传类型
     */
    exceed(files, fileList) {
      if (fileList.length == 2) {
        this.fileList = [files];
      }
    },

    /*
   限制上传类型
     */
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "csv" || testmsg === "xlsx" || testmsg === "xls";

      // const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension) {
        this.$message({
          message: "上传文件只能是 csv、xls、xlsx 格式!",
          type: "warning",
        });
      }

      return extension;
    },
    /*

    确认上传
     */
    submitUpload(itemRef) {
      if (itemRef == "upload") {
        this.curRecordUpload.taskId = this.rowData.taskId;
      }

      this.$refs[`${itemRef}`].submit();
    },
    /*

    上传失败
     */
    uploadError: function (err) {
      this.$message.error(res.msg);
    },
    /*

    上传
     */
    uploadSucess: function (response) {
      if (response.state == "0000") {
        this.$message({
          type: "success",
          message: "导入成功",
        });
        this.$refs.upload.clearFiles();
        this.isImport = false;
        this.List();
      } else {
        this.$refs.upload.clearFiles();
        this.$message.error(response.msg);
      }
    },
    /*

    下载svc模板
     */
    PPTDownload() {
      axios({
          method: "get",
          url: "/api/callTask/downloadTemplate",
          params: {
            taskId: this.rowData.taskId,
          },
          headers:{token:getStorage("token")},
          responseType: "blob",
        }).then((res) => {
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute(
            "download",
            `svc模板.csv`
          );
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        });
    },
    /*

    下载excel模板
     */
    ExDownload() {
      axios({
          method: "get",
          url: "/api/callTask/downloadExcelTemplate",
          params: {
            taskId: this.rowData.taskId,
          },
          headers:{token:getStorage("token")},
          responseType: "blob",
        }).then((res) => {
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute(
            "download",
            `excel模板.xlsx`
          );
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        });
    },
    /*

     删除
     */
    del(index, row) {
      const self = this;

      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        self.loading = true;
        var data = {
          data: { taskId: row.taskId, status: "2" },
          version: "1.0",
        };
        this.$http.outbound.updateInboundStatus(data).then((res) => {
          if (res.state == "0000") {
            self.$message({
              type: "success",
              message: "删除成功!",
            });
            // if (self.tableData.length == 1 && self.page != 0) {
            //   self.page = self.page - 1;
            // }
            self.List();
          } else {
            self.loading = false;
            self.$message.error(res.msg);
          }
        });
      });
    },
    /*

      启用 ，禁用
     */
    status(index, row, i) {
      const self = this;
      self.loading = true;
      var data = {
        data: {
          taskId: row.taskId,
          status: i,
        },
        version: "1.0",
      };
      this.$http.outbound.updateInboundStatus(data).then((res) => {
        if (res.state == "0000") {
          self.$message({
            type: "success",
            message: "修改成功!",
          });
          self.List();
        } else {
          self.loading = false;
          self.$message.error(res.msg);
        }
      });
    },
    /*
      查询场景名称列表
     */
    queryListScene() {
      const self = this;
      console.log(this.info,'======info')
      console.log(self.quertForm.corpId)
      if (!self.quertForm.corpId) {
        self.querySceneData = [];
        self.quertForm.sceneId = "";
        return;
      }
      var data = {
        data: {
          corpId: self.quertForm.corpId,
        },
        version: "1.0",
      };
      this.$http.outbound.listSceneByState(data).then((res) => {
        if (res.state == "0000") {
          // sceneId
          var SceneIdArr = res.data.filter(
            (val) => val.sceneId == self.quertForm.sceneId
          );
          if (SceneIdArr.length == 0) {
            self.quertForm.sceneId = "";
            self.quertForm.inboundCallerId = "";
          }
          self.querySceneData = res.data;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    /*
      商户列表
     */
    listClient() {
      const self = this;
      var data = {
        corpType: 0,
      };
      this.$http.select.queryCorpByCorpType(data).then((res) => {
        if (res.state == "0000") {
          self.clientList = res.data.records;
        } else {
          self.$message.error(res.msg);
        }
      });
    },

    /*
     分页
     */
    pagingChange(val) {
      this.page = val;
      this.List();
    },
    /*
    新增  编辑
     */
    mewSubmit(formName) {
      const self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 时间段格式处理
          self.RuleForm.callTime1End = self.RuleForm.callTime1Start
            ? self.RuleForm.callTime1Start[1]
            : null;
          self.RuleForm.callTime1Start = self.RuleForm.callTime1Start
            ? self.RuleForm.callTime1Start[0]
            : null;
          //  时间段2
          self.RuleForm.callTime2End = self.RuleForm.callTime2Start
            ? self.RuleForm.callTime2Start[1]
            : null;
          self.RuleForm.callTime2Start = self.RuleForm.callTime2Start
            ? self.RuleForm.callTime2Start[0]
            : null;
          //  时间段3
          self.RuleForm.callTime3End = self.RuleForm.callTime3Start
            ? self.RuleForm.callTime3Start[1]
            : null;
          self.RuleForm.callTime3Start = self.RuleForm.callTime3Start
            ? self.RuleForm.callTime3Start[0]
            : null;
          self.SubmitLoading = true;

          if (this.title == "新增") {
            let data = {
              data: {
                ...self.RuleForm,
                weekDays:
                  this.RuleForm.weekDays.length > 0
                    ? this.RuleForm.weekDays
                    : null,
              },

              version: "1.0",
            };
            console.log(data);
            this.$http.outbound.addInbound(data).then((res) => {
              self.SubmitLoading = false;
              if (res.state == "0000") {
                self.isNew = false;

                self.$message({
                  type: "success",
                  message: "新增成功!",
                });

                self.List();
              } else {
                self.$message.error(res.msg);
              }
            });
          } else {
            let data = {
              data: {
                ...this.RuleForm,
                taskId: this.curInboundId,
                weekDays:
                  this.RuleForm.weekDays.length > 0
                    ? this.RuleForm.weekDays
                    : null,
              },

              version: "1.0",
            };
            console.log(data);
            this.$http.outbound.updateInbound(data).then((res) => {
              self.SubmitLoading = false;
              if (res.state == "0000") {
                self.isNew = false;

                self.$message({
                  type: "success",
                  message: "编辑成功!",
                });
                self.List();
              } else {
                self.$message.error(res.msg);
              }
            });
          }
        } else {
          // if (self.subInbound == 1) {
          //   self.$message.error("号码已经使用,无法新增或修改");
          // }
          console.log("error submit!!");
          return false;
        }
      });
    },
    /*

     新增 ,编辑
     */
    NewlyEdit(index, row) {
      if (row) {
        this.rowData = row;
        this.curInboundId = row.taskId;
        console.log(row.taskName);
        this.RuleForm = {
          corpId: row.corpId, //商户id
          taskName: row.taskName, //任务名称
          taskType: row.taskType, //任务类型
          extId: row.extId, //线路ID
          sceneId: row.sceneId, //场景ID
          concurrency: row.concurrency, //并发数
          startDate: row.startDate,
            // ? [new Date(row.startDate), new Date(row.stopDate)]
            // : "", //开始日期
          // startDate: row.startDate
          //   ? [new Date(row.startDate), new Date(row.stopDate)]
          //   : "", //开始日期
          stopDate: row.stopDate,
          weekDays: row.weekDays ? eval("(" + row.weekDays + ")") : [], //周天
          // maxCallCount: row.maxCallCount, //最大呼叫次数
          // asrEnable: row.asrEnable, //是否启用识别

          callTime1Start:
            row.callTime1Start != null
              ? [row.callTime1Start, row.callTime1End]
              : " ",
          callTime1End: "",
          callTime2Start:
            row.callTime2Start != null
              ? [row.callTime2Start, row.callTime2End]
              : "",
          callTime2End: "",
          callTime3Start:
            row.callTime3Start != null
              ? [row.callTime3Start, row.callTime3End]
              : "",
          callTime3End: " ",
        };
        this.getExtList();
        this.listScene();
        console.log(this.RuleForm);
        this.title = "编辑";
      } else {
        this.title = "新增";

        this.hasAudio = false;
        this.querySceneData = [];
        this.RuleForm = {
          corpId: "", //商户id
          taskName: "", //任务名称
          taskType: "", //任务类型
          extId: "", //线路ID
          sceneId: "", //场景ID
          concurrency: "", //并发数
          startDate: "", //开始日期
          stopDate: "",
          weekDays: [], //周天
          callTime1Start: "",
          callTime1End: "",
          callTime2Start: "",
          callTime2End: "",
          callTime3Start: "",
          callTime3End: "",
        };
      }
      this.isNew = true;
    },

    //验证表单
    validateForm() {},
    /*
     列表
     */
    List(i) {
      const self = this;
      self.loading = true;
      console.log(self.page);
      if (i == "query") {
        self.page = 1;
      }
      if (self.quertForm.startEndTime == null) {
        self.quertForm.startEndTime = ["", ""];
      }
      var data = {
        data: {
          pageNumber: self.page - 1,
          pageSize: self.size,
          inboundConfig: {
            corpId: self.quertForm.corpId,
            mobile: self.quertForm.phone,
            sceneId: self.quertForm.sceneId,
            startTime:
              self.quertForm.startEndTime.length > 0
                ? new Date(self.quertForm.startEndTime[0]).Format(
                    "yyyy-MM-dd hh:mm:ss"
                  )
                : new Date(
                    new Date(new Date().toLocaleDateString()).getTime() -
                      24 * 60 * 60 * 1000 * 6
                  ),
            endTime:
              self.quertForm.startEndTime.length > 0
                ? new Date(self.quertForm.startEndTime[1]).Format(
                    "yyyy-MM-dd hh:mm:ss"
                  )
                : new Date(
                    new Date(new Date().toLocaleDateString()).getTime() +
                      (24 * 60 * 60 * 1000 - 1)
                  ),
          },
        },
        version: "1.0",
      };
      this.$http.outbound.listTaskByPage(data).then((res) => {
        self.loading = false;
        if (res.state == "0000") {
          var arr = [];

          res.data.records.forEach((val) => {
            val.create = new Date(val.createTime).Format("yyyy-MM-dd hh:mm:ss");
            val.update = new Date(val.updateTime).Format("yyyy-MM-dd hh:mm:ss");
            if (val.status == 0) val.statusText = "禁用";
            if (val.status == 1) val.statusText = "启用";
            if (val.status == 2) val.statusText = "已删除";
          });

          self.tableData = res.data.records;
          self.totalNumber = res.data.total;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    /*
    路由跳转
     */

    push(url, row) {
      this.$router.push({
        path: url,
        query: {
          taskId: row.taskId,
        },
      });
    },

    numberTest(str) {
      let reg = /^[0-9]*$/;
      return reg.test(str);
    },
  },
};
</script>
<style lang="scss" scoped>
#noteBox {
  width: 100%;
  // padding: 20px;

  box-sizing: border-box;
  #listBox {
    width: 100%;
  }
  // /deep/ .el-table td {
  //   padding: 7px 0;
  // }
  /deep/ .el-dialog__body {
    padding: 15px 20px;
  }
}
.upload-demo {
  margin-top: 15px;
}
.demo-drawer__footer {
  width: 50%;
  position: fixed;
  bottom: 0;
  padding: 20px 0;
  display: flex;
  justify-content: center;
}
.downDiv {
  width: 95%;
  margin: 0 auto 20px;
  border: 3px solid #f2f2f2;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
}
.downDiv p:nth-last-child(1) {
  font-size: 16px;
  color: #333;
}
</style>
