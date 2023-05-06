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
      <el-table-column prop="attendName" label="坐席姓名" />
      <el-table-column prop="jobNumber" label="工号" />
      <el-table-column prop="callerId" label="主叫号码" />
      <el-table-column prop="calledId" label="被叫号码" />
      <el-table-column prop="talkDuration" label="通话时长(秒)" />
      <el-table-column prop="callType" label="呼叫方向" >
        <template slot-scope="{row}">
          <span v-if="row.callType == 1">AI外呼</span>
          <span v-if="row.callType == 2">外呼人工</span>
          <span v-if="row.callType == 3">呼入</span>
          <span v-if="row.callType == 4">呼入人工</span>
          <span v-if="row.callType == 5">呼出</span>
        </template>
      </el-table-column>
      <el-table-column prop="isConnected" label="呼叫结果" >
        <template slot-scope="{row}">
          <span v-if="row.isConnected == 0">失败</span>
          <span v-if="row.isConnected == 1">成功</span>
        </template>
      </el-table-column>
      <el-table-column prop="satisfaction" label="满意度" />
      <el-table-column prop="hungUpPerson" label="挂断方" />
      <el-table-column prop="recordFile" label="录音" >
        <template slot-scope="{ row }">
          <el-button type="text" @click="look(row)">查看录音</el-button>
          <!-- <a :href="origin + row.recordFile" target="_blank" rel="noopener noreferrer">录音</a> -->
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
      top="150px"
      :destroy-on-close="true"
    >
      <div class="audition">
        <div class="audio-con">
          <audio :src="auditionUrl" controls ref="myAudio"></audio>
        </div>
        <div v-if="!auditionUrl" class="audio-con"></div>
        <el-button type="primary" @click="Audition()" style="height: 40px">
          完整录音试听
          <i class="el-icon-headset el-icon--right"></i>
        </el-button>
      </div>
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
      // 搜索框配置
      searchFormConfig: [
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
      title: "",
      isDetails: false,
      auditionUrl: "",
      detailsData: [],
      origin: process.env.VUE_APP_HOST_URL,
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    look(row) {
      this.$nextTick(() => {
        this.auditionUrl = row.recordFile;
      });

      this.isDetails = true;
    },
    /**
     * 调整筛选条件提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      data.corpId = JSON.parse(getStorage("info")).corpId;
      return data;
    },
    /*
      试听
     */
    Audition() {
      let audio = this.$refs.myAudio;
      setTimeout(() => {
        if (audio.paused === false) {
          audio.pause();
          return false;
        }
        audio.play();
      }, 200);
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
