<template>
  <div class="NavMenu">
    <div class="nav_conent">
      <div class="nav_conent_title">呼叫中心</div>

      <div class="nav_conent_handle clearfix">
        <div class="handle" v-if="isShowTel">
          <!-- <div style="margin-right: 20px" v-if="info.ext">
          分机号：{{ info.ext }}
        </div> -->
          <el-input v-model="tell" style="width: 150px" clearable class="tellInp">
          </el-input>
          <el-button
              class="tellBtn"
              icon="el-icon-phone"
              @click="cell"
              :disabled="!destroyDisabled"
              >呼叫</el-button
            >
          <!-- <div>
          <img src="" alt="">
        </div> -->
          <el-button
            type="danger"
            icon="el-icon-phone"
            size="small"
            round
            style="margin-left: 20px"
            :disabled="destroyDisabled"
            @click="hangupCall()"
            :class="{ shake: isRinging }"
            >挂断</el-button
          >
          <el-button
            type="success"
            size="small"
            icon="el-icon-phone"
            round
            @click="answerCall()"
            :disabled="vertoStatus == 'active'"
            :class="{ shake: isRinging }"
            >接听</el-button
          >
          <!-- <el-button type="primary" icon="el-icon-phone" size="small" round @click="muteCall()">静音</el-button> -->
          <!-- <el-button
          type="primary"
          icon="el-icon-phone"
          size="small"
          round
          @click="muteUnmuteCall()"
          >静音/取消静音</el-button
        > -->
          <el-button icon="el-icon-phone" size="small" round @click="holdCall()"
          :disabled="vertoStatus !== 'active' && !callDuration"
            >保持通话</el-button
          >
          <el-button
            icon="el-icon-phone"
            size="small"
            round
            :disabled="vertoStatus !== 'held'"
            @click="unholdCall()"
            >恢复通话</el-button
          >
          <el-button
            icon="el-icon-phone"
            size="small"
            round
            :disabled="vertoStatus !== 'active' && !callDuration"
            @click="transferCall()"
            >转接</el-button
          >
          <span style="padding-left: 20px" v-show="callDuration">通话时长：{{ this.timeTxt }}</span>
        </div>
        <!-- <el-button type="primary" icon="el-icon-phone" size="small" round>置忙</el-button>
        <el-button type="primary" icon="el-icon-phone" size="small" round>置闲</el-button>
        <el-button type="primary" icon="el-icon-phone" size="small" round>休息</el-button>
        <el-button type="primary" icon="el-icon-phone" size="small" round>长签</el-button>
        <el-button type="primary" icon="el-icon-phone" size="small" round>退签</el-button>
        <el-button type="primary" icon="el-icon-phone" size="small" round>班组</el-button> -->
        <div class="user">
          <span>工号：{{ info.jobNumber }}</span>
          <div v-if="isShowTel">
            <span>状态：</span>
            <el-select
              v-model="states"
              style="width: 100px"
              @change="changeStates"
            >
              <el-option label="就绪" :value="2"></el-option>
              <el-option label="暂停" :value="4"></el-option>
            </el-select>
          </div>

          <el-button
            type="text"
            style="margin: 0 20px; height: 80px"
            @click="logout"
            >退出</el-button
          >
        </div>
      </div>
      <video
        id="webcam"
        ref="webcam"
        autoplay="autoplay"
        style="width: 100%; height: 500px; object-fit: inherit; display: black !important;"
      ></video>
      <video
        id="webcam1"
        ref="webcam1"
        autoplay="autoplay"
        style="width: 100%; height: 500px; object-fit: inherit; display: black !important;"
      ></video>
      <video
        id="webcam2"
        ref="webcam2"
        autoplay="autoplay"
        style="width: 100%; height: 500px; object-fit: inherit; display: black !important;"
      ></video>
    </div>
    

    <el-dialog
      title="温馨提示"
      :visible.sync="confirmVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="30%"
      custom-class="confirm_visible"
    >
      <div slot="title" class="header_title">
        <span
          ><i
            class="el-icon-warning"
            style="color: #ff8800; font-size: 26px"
          ></i>
        </span>
        <span class="title">是否退出登录？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitExport"
          style="margin-left: 16px"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setStorage, getStorage } from "@/utils/auth.js";
import {
  init,
  makeCall,
  hangupCall,
  answerCall,
  muteCall,
  unmuteCall,
  holdCall,
  unholdCall,
  muteUnmuteCall,
  transferCall,
  logout,
} from "./verto.js";

export default {
  components: {},
  data() {
    return {
      name: "xxx",
      account: "xxx",
      confirmVisible: false,
      isRinging: false,
      destroyDisabled: true,
      tell: "",
      states: 2,
      info: JSON.parse(getStorage("info")),
      isShowTel: true,
      callDuration: false,
      second: 1,
      minute: 0,
      hours: 0,
      s10: "",
      m10: "",
      h10: "",
      timeTxt: "00:00:00",
      setTime:null,
      vertoStatus:null,
    };
  },
  created() {
    navigator.mediaDevices.getUserMedia({ audio: true })
  },
  mounted() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    if (JSON.parse(getStorage("info")) !== null) {
      const { name, account, sysMenus,ext, extPwd, extUrl, extPort } = JSON.parse(getStorage("info"));
      init(ext, extPwd, extUrl, extPort);
      this.name = name;
      this.account = account;
      this.$nextTick(() => {
        if (sysMenus && sysMenus.length > 0) {
          sysMenus.forEach((item) => {
            if (item.linkUrl === "/tel" && item.ifChecked === "1") {
              this.$nextTick(() => {
                this.isShowTel = true;
              });
            } else {
              this.isShowTel = false;
            }
          });
        } else {
          this.isShowTel = false;
        }
      });
    }
    
    // window.addEventListener("click", () => {
    //   console.log("Click")
    // });
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener('beforeunload', (e) => {
      this._beforeUnload_time = new Date().getTime()
      console.log(this._beforeUnload_time, 'this._beforeUnload_time')
    })
    window.addEventListener('unload', () => {
      this._gap_time = new Date().getTime() - this._beforeUnload_time
      console.log(this._gap_time, 'ssss', new Date().getTime(), this._beforeUnload_time)
      if (this._gap_time <= 5) {
        //关闭
        this.logout()
        window.confirm('关闭页面')
        alert("关闭页面")
        // localStorage.removeItem('token')
      } else {
        window.confirm('关闭页面')
        // 刷新
        console.log('刷新页面')
      }
    })
  },
  computed: {},
  methods: {
    startTime() {
      if (this.second > 0 && this.second % 60 == 0) {
        this.minute += 1;
        this.second = 0;
      }
      if (this.minute > 0 && this.minute % 60 == 0) {
        this.hours += 1;
        this.minute = 0;
      }
      this.s10 = this.second < 10 ? `0${this.second}` : this.second;
      this.m10 = this.minute < 10 ? `0${this.minute}` : this.minute;
      this.h10 = this.hours < 10 ? `0${this.hours}` : this.hours;
      this.$nextTick(() => {
        this.timeTxt = this.h10 + ":" + this.m10 + ":" + this.s10;
      });
      this.second += 1;
    },
    keyDown(e) {
      //如果是回车则执行登录方法
      if (e.keyCode == 13) {
        this.cell();
      }
    },
    //拨打电话
    cell() {
      if (/[\u4E00-\u9FA5]/g.test(this.tell)) {
        this.$message.error("拨打电话不能输入汉字!");
      } else {
        makeCall(this.tell);
      }
    },
    hangupCall() {
      hangupCall();
    },
    answerCall() {
      answerCall();
    },
    muteCall() {
      muteCall();
    },
    unmuteCall() {
      unmuteCall();
    },
    holdCall() {
      holdCall();
    },
    unholdCall() {
      unholdCall();
    },
    muteUnmuteCall() {
      muteUnmuteCall();
    },
    //转接
    transferCall() {
      transferCall();
    },
    async logout(e) {
      await this.$http.login.logout().then((res) => {
        if (res.state === "200") {
          try {
            logout();
            setStorage("token");
            setStorage("info");
            this.$router.push("/login");
            if (!this.$store.state.IsLogout) {
              this.$message.success("退出成功！");
            }
          } catch {
            setStorage("token");
            setStorage("info");
            this.$router.push("/login");
            if (!this.$store.state.IsLogout) {
              this.$message.success("退出成功！");
            }
          }
        }
      });
    },
    handleCommand() {
      this.confirmVisible = true;
    },
    submitExport() {
      try {
      } catch {}
      setStorage("token");
      setStorage("info");
      this.$router.push("/login");
      // logout().then((res) => {
      //   if (res.code === 200) {
      //     this.$message.success("退出成功");
      //   }
      // });
    },
    changeStates(e) {
      this.$http.role
        .updateAttendAndLoginMode({
          attendId: this.info.attendId,
          attendStatus: e,
        })
        .then((res) => {
          if (res.state === "200") {
            this.$message.success("修改状态成功");
          } else {
            this.$message.error("修改状态失败");
          }
        });
    },
  },
  destroyed() {
    window.removeEventListener("keydown", this.keyDown, false);
     window.removeEventListener('beforeunload')
    window.removeEventListener('unload')
  },
  watch: {
    "$store.state.vertoState": {
      immediate: true,
      deep: true,
      handler(val) {
        this.vertoStatus = val;
        if (val == "ringing") {
          this.destroyDisabled = false;
          this.isRinging = true;
        } else if (val == "active") {
          this.destroyDisabled = false;
        }else if (val == "trying"){
          this.destroyDisabled = false;
        }else if(val == 'connect'){
          this.callDuration = true
          this.setTime = setInterval(() => {
            this.startTime();
          }, 1000);
        }
        else if (val == "early"){
          this.destroyDisabled = false;
        }else if(val == 'destroy'){
          this.callDuration = false;
          this.setTime = clearInterval(this.setTime);
          this.second = 1;
          this.minute = 0;
          this.hours = 0;
          this.s10 = "";
          this.m10 = "";
          this.h10 = "";
          this.timeTxt = "00:00:00";
        } else {
          this.isRinging = false;
          this.destroyDisabled = true;
          
        }
      },
    },
    "$store.state.IsLogin": {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          console.log('登录')
          this.$notify.closeAll()
           
          setTimeout(()=>{
            this.$notify({
              title: '成功',
              message: '拨打电话服务连接成功~',
              type: 'success',
            });
          })
          
        } else{
          this.$notify({
            title: '重新连接',
            message: '请稍后，拨打电话服务正在重连~',
            duration: 0,
          });
          console.log('退出')
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dropdown-menu__item:focus,
::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
  color: #1890ff !important;
  background: #f3f9ff !important;
}
.NavMenu {
  width: 100%;
  height: 80px;
  line-height: 80px;
  // background: url("../../../assets/images/header_back.png") no-repeat;
  background-size: cover;
  overflow: hidden;
  background: #182131;
  .nav_conent {
    background: #182131;
    color: #fff;
    .nav_conent_title {
      width: 176px;
      float: left;
      text-align: center;
      // padding-left: 24px;
      font-family: PingFangSC-Medium;
      font-weight: Medium;
      font-size: 22px;
      color: #ffffff;
      font-weight: bold;
    }
    .nav_conent_handle {
      float: right;
      height: 80px;
      line-height: 80px;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      width: calc(100% - 176px);
      .tellInp{
        ::v-deep .el-input__inner{
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          border-right: none !important;
        }
      }
      .tellBtn {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
        padding: 12px 10px !important;
      }
      .shake {
        animation: shake 800ms ease-in-out infinite;
      }
      @keyframes shake {
        /* 水平抖动，核心代码 */
        10%,
        90% {
          transform: translate3d(-1px, 0, 0);
        }
        20%,
        80% {
          transform: translate3d(+2px, 0, 0);
        }
        30%,
        70% {
          transform: translate3d(-4px, 0, 0);
        }
        40%,
        60% {
          transform: translate3d(+4px, 0, 0);
        }
        50% {
          transform: translate3d(-4px, 0, 0);
        }
      }
      .handle_name {
        line-height: 1;
        .name_txt {
          padding-right: 0px;
        }
        .name_img {
          display: inline-block;
          margin-top: 4px;
          margin-right: 5px;
          vertical-align: bottom;
          width: 14px;
          height: 14px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      ::v-deep .el-dropdown {
        height: 80px;
      }

      ::v-deep .el-dropdown-link {
        height: 80px;
        display: inline-block;
        border-top: 0 red solid;
      }
      ::v-deep .el-dropdown-link .link_img {
        display: inline-block;
        margin-top: 13px;
        margin-right: 12px;
        width: 36px;
        height: 36px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      ::v-deep .el-dropdown-link .link_account {
        display: inline-block;
        vertical-align: top;
        font-family: PingFangSC-Medium;
        font-weight: Medium;
        font-size: 16px;
        color: #ffffff;
        i {
          font-size: 10px;
        }
      }

      span,
      .handle_name {
        padding-right: 20px;
        font-family: PingFangSC-Regular;
        font-weight: Regular;
        font-size: 14px;
        color: #ffffff;
      }
      span:last-child {
        cursor: pointer;
      }
      .user,
      .handle {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .handle {
        float: left;
        height: 80px;
      }
      .user {
        float: right;
      }
    }
  }
  ::v-deep .confirm_visible {
    height: 128px;
    line-height: 1;
    .header_title {
      .title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #1f2329;
        line-height: 24px;
        padding-left: 16px;
        vertical-align: text-bottom;
      }
      .content {
        font-family: PingFangSC-Regular;
        font-weight: Regular;
        font-size: 14px;
        color: #1f2329;
        padding-top: 8px;
        padding-left: 42px;
      }
    }
    .el-dialog__header {
      padding: 24px 24px 10px;
    }
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__footer {
      padding: 10px 24px 24px;
      margin-top: 4px;
    }
  }
}
</style>
