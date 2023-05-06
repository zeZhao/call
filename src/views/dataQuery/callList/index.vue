<template>
  <div class="company">
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
      <el-table-column label="序号" type="index" align="center" />
      <!-- <el-table-column prop="corpName" label="企业名称" /> -->
      <el-table-column prop="taskName" label="任务名称" />
      <el-table-column prop="connTime" label="开始时间" >
        <template slot-scope="{row}">
          <span>{{row.connTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="终止时间" >
        <template slot-scope="{row}">
          <span>{{row.endTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="calledId" label="被叫号码" />
      <el-table-column prop="talkDuration" label="通话时长（秒）" />
      <el-table-column prop="hungUpPerson" label="挂断方" />
      <el-table-column prop="isConnected" label="呼叫结果" >
        <template slot-scope="{row}">
          <span v-if="row.isConnected == 0">失败</span>
          <span v-if="row.isConnected == 1">成功</span>
        </template>
      </el-table-column>
      <el-table-column prop="dataTag" label="标签" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="dialogue(scope.index, scope.row)"
            type="text"
            size="small"
            >通话详情</el-button
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
      :title="title"
      :visible.sync="isDetails"
      width="50%"
      top="30px"
      :destroy-on-close="true"
    >
      <div class="audition">
        <div v-if="auditionUrl" class="audio-con">
          <audio :src="auditionUrl" controls ref="myAudio"></audio>
        </div>
        <div v-if="!auditionUrl" class="audio-con"></div>
        <el-button
          type="primary"
          @click="Audition(rowData.recordFile)"
          style="height: 40px"
        >
          完整录音试听
          <i class="el-icon-headset el-icon--right"></i>
        </el-button>
      </div>
      <div class="conversation">
        <ul v-for="(item, index) in detailsData" :key="index">
          <li>
            <div class="date">
              <span class="img_logo">
                <img src="../../../assets/images/robot.png" alt />
              </span>
              <span>
                机器人：{{ item.robotSpeechTime }}
                <i
                  class="el-icon-service"
                  @click="Audition(item.branchAudio)"
                ></i>
              </span>
            </div>

            <span class="content">{{ item.robotSpeechText }}</span>
          </li>
          <li class="liRight">
            <!-- 不可以删 -->
            <div></div>
            <div v-show="item.customerSpeechText">
              <div class="date customer">
                <span>
                  客户：{{ item.customerSpeechTime }}
                  <i
                    class="el-icon-service"
                    @click="Audition(item.replyAudio)"
                  ></i>
                </span>
                <span class="img_logo">
                  <img src="../../../assets/images/client.png" alt />
                </span>
              </div>

              <div class="content cur">{{ item.customerSpeechText }}</div>
            </div>
          </li>
        </ul>
      </div>
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
        // { type: "select", label: "公司名称", key: "corpId", optionData: [] },
        { type: "select", label: "任务名称", key: "taskId",optionData:[] },
        { type: "input", label: "被叫", key: "calledId" },
        { type: "input", label: "被叫标签", key: "dataTag" },
        { type: "input", label: "通话时长>", key: "talkDuration" },
        { type: "input", label: "挂断方", key: "hungUpPerson" },
        {
          type: "select",
          label: "呼叫结果",
          key: "isConnected",
          optionData: [
            { key: "0", value: "失败" },
            { key: "1", value: "成功" },
          ],
        },
        { type: "datetime", label: "接通时间", key: ["","callStartTime","callEndTime"] },
      ],
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "dataquery",
        list: "voicetalkList",
      },
      isParamsNotData: false,
      submitParamsIsData: false,
      // 列表参数
      namespace: "",
      namespaceType: "Array",
      title: "",
      isDetails: false,
      auditionUrl: "",
      detailsData: []
    };
  },
  created() {},
  mounted() {
    // this.queryCorpByCorpType()
    this.listTask()
  },
  activated(){
    // this.queryCorpByCorpType()
    this.listTask()
  },
  computed: {},
  methods: {
    //获取公司下拉
    // corpType（0:商家,1:代理商,2:供应商）
    // queryCorpByCorpType(corpType) {
    //   this.$http.select.queryCorpByCorpType({ corpType: "0" }).then((res) => {
    //     this._setDefaultValue(
    //       this.searchFormConfig,
    //       res.data.records,
    //       "corpId",
    //       "corpId",
    //       "corpName"
    //     );
    //   });
    // },
    listTask() {
      this.$http.select.listTask().then((res) => {
        this._setDefaultValue(
          this.searchFormConfig,
          res.data,
          "taskId",
          "taskId",
          "taskName"
        );
      });
    },
    // //获取供应商账户
    // getCorpListAll(){
    //   this.$http.select.corpListAll({}).then(res=>{
    //     this._setDefaultValue(this.searchFormConfig,res.data.records,'supplyId','supplyId','userName')
    //   })
    // },
    // // 获取商户账户
    // getUserListAll(){
    //   this.$http.select.userListAll({}).then(res=>{
    //     this._setDefaultValue(this.searchFormConfig,res.data.records,'userId','userId','userName')
    //   })
    // },
    // // 获取代理商账户
    // getAgentListAll(){
    //   this.$http.select.agentListAll({}).then(res=>{
    //     this._setDefaultValue(this.searchFormConfig,res.data.records,'agentId','agentId','userName')
    //   })
    // },
    /*
      试听
     */
    Audition(url) {
      if (url) {
        this.auditionUrl = url;
        let audio = this.$refs.myAudio;
        setTimeout(() => {
          if (audio.paused === false) {
            audio.pause();
            return false;
          }
          audio.play();
        }, 200);
      }
    },
    /*
      对话详情
     */
    dialogue(index, row) {
      const self = this;

      self.rowData = row;
      this.auditionUrl = row.recordFile;
      self.title =
        "电话：" + self.rowData.calledId + "   时间：" + new Date(self.rowData.startTime).Format("yyyy-MM-dd hh:mm:ss");
      this.$http.dataquery.voicetalkAiList(row.dataId).then(res => {
        if (res.state == "0000") {
          if (res.data.length == 0) {
            self.$notify({
              title: "提示",
              message: "暂无对话详情"
            });
            return;
          }
          self.isDetails = true;
          res.data.forEach(val => {
            val.robotSpeechTime = new Date(val.robotSpeechTime).Format("yyyy-MM-dd hh:mm:ss");
            val.customerSpeechTime = new Date(val.customerSpeechTime).Format("yyyy-MM-dd hh:mm:ss");
            // val.custSpeechTime = datetime(val.custSpeechTime);
          });
          self.detailsData = res.data;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.audition {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.audio-con {
  width: 70%;
}
.audio-con audio {
  width: 100%;
}
.conversation {
  margin-top: 20px;
  padding-top: 10px;
  width: 100%;
  max-height: 500px;
  background: white;
  overflow-y: scroll;
  ul {
    width: 100%;
    margin: 0;
    padding: 0;
    padding: 0 10px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    li {
      width: 50%;
      list-style-type: none;

      margin-bottom: 5px;
      float: left;

      .date {
        display: flex;
      }
    }
    li.liRight {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .date {
        text-align: right;
      }
      .customer{
        justify-content: end;
      }
    }

    .img_logo {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid rgb(107, 103, 103);
      display: inline-block;

      margin-right: 15px;
      img {
        width: 30px;
        height: 30px;
        padding: 2px;
        box-sizing: border-box;
      }
    }
    .img_logo:nth-child(2) {
      margin-left: 15px;
    }
    .content {
      margin-top: 15px;
      margin-left: 20px;
      background: #0181cc;
      padding: 10px;
      box-sizing: border-box;
      border-radius: 10px;
      color: white;
      display: inline-block;
    }
    .content.cur {
      margin-right: 20px;
      width: 280px;
      background: #ef8201;
      float: right;
    }
  }
}
</style>
