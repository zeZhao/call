<template>
  <div class="Tel">
    <div class="handle">
      <!-- <div style="margin-right: 20px" v-if="info.ext">
          分机号：{{ info.ext }}
        </div> -->
      <!-- <el-image src="@/assets/images/lingdang1.png"></el-image> -->
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
        :type="destroyDisabled?'':'danger'"
        icon="el-icon-phone"
        size="small"
        round
        style="margin-left: 20px"
        :disabled="destroyDisabled"
        @click="hangupCall()"
        >挂断</el-button
      >
      <el-button
        :type="!isRinging?'':'success'"
        size="small"
        icon="el-icon-phone"
        round
        @click="answerCall()"
        :disabled="
          !isRinging
        "
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
      <el-button
        icon="el-icon-phone"
        size="small"
        round
        @click="holdCall()"
        :disabled="(vertoStatus !== 'active' && !callDuration) || isHeld"
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
      <span style="padding-left: 20px" v-show="callDuration"
        >通话时长：{{ this.timeTxt }}</span
      >
    </div>
    <video
      id="webcam"
      ref="webcam"
      autoplay="autoplay"
      style="
        width: 100%;
        height: 500px;
        object-fit: inherit;
        display: none !important;
      "
    ></video>
    <video
      id="webcam1"
      ref="webcam1"
      autoplay="autoplay"
      style="
        width: 100%;
        height: 500px;
        object-fit: inherit;
        display: none !important;
      "
    ></video>
    <video
      id="webcam2"
      ref="webcam2"
      autoplay="autoplay"
      style="
        width: 100%;
        height: 500px;
        object-fit: inherit;
        display: none !important;
      "
    ></video>
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
} from "@/assets/js/verto.js";
export default {
  components: {},
  data() {
    return {
      isRinging: false,
      destroyDisabled: true,
      tell: "",
      info: JSON.parse(getStorage("info")),
      callDuration: false,
      second: 1,
      minute: 0,
      hours: 0,
      s10: "",
      m10: "",
      h10: "",
      timeTxt: "00:00:00",
      setTime: null,
      vertoStatus: null,
      isHeld: false,
    };
  },
  created() {
    navigator.mediaDevices.getUserMedia({ audio: true });
  },
  mounted() {
    navigator.mediaDevices.getUserMedia({ audio: true });
    if (JSON.parse(getStorage("info")) !== null) {
      const { ext, extPwd, extUrl, extPort } = JSON.parse(getStorage("info"));
      init(ext, extPwd, extUrl, extPort);
    }

    // window.addEventListener("click", () => {
    //   console.log("Click")
    // });
    window.addEventListener("keydown", this.keyDown);
    // window.addEventListener('beforeunload', (e) => {
    //   this._beforeUnload_time = new Date().getTime()
    //   console.log(this._beforeUnload_time, 'this._beforeUnload_time')
    // })
    // window.addEventListener('unload', () => {
    //   this._gap_time = new Date().getTime() - this._beforeUnload_time
    //   console.log(this._gap_time, 'ssss', new Date().getTime(), this._beforeUnload_time)
    //   if (this._gap_time <= 5) {
    //     //关闭
    //     this.logout()
    //     window.confirm('关闭页面')
    //     alert("关闭页面")
    //     // localStorage.removeItem('token')
    //   } else {
    //     window.confirm('关闭页面')
    //     // 刷新
    //     console.log('刷新页面')
    //   }
    // })
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
  },
  destroyed() {
    window.removeEventListener("keydown", this.keyDown, false);
    // window.removeEventListener('beforeunload')
    // window.removeEventListener('unload')
  },
  watch: {
    /**
     * 通话状态
     *
     * @value trying   正在尝试建立连接
     * @value early    已经建立连接，等待对方回应
     * @value ringing  振铃中
     * @value active   正在拨打电话/电话已接通
     * @value connect  正在通话
     * @value destroy  电话挂断
     * @value fileName
     * @value fileName
     */
    "$store.state.vertoState": {
      immediate: true,
      deep: true,
      handler(val) {
        this.vertoStatus = val;

        if (val == "ringing") {
          // 添加振铃样式
          this.isRinging = true;
          // 可以挂断
          this.destroyDisabled = false;
        } else if (val == "trying") {
          this.destroyDisabled = false;
        } else if (val == "early") {
          this.destroyDisabled = false;
        } else if (val == "active") {
          this.destroyDisabled = false;
          this.isHeld = false;
        } else if (val == "connect") {
          // 展示通话时长
          this.callDuration = true;
          this.isHeld = false;
          this.setTime = setInterval(() => {
            this.startTime();
          }, 1000);
        } else if (val == "held") {
          this.isHeld = true;
          this.destroyDisabled = false;
        } else if (val == "destroy") {
          // 关闭通话时长
          this.callDuration = false;
          this.isHeld = false;
          this.setTime = clearInterval(this.setTime);
          this.second = 1;
          this.minute = 0;
          this.hours = 0;
          this.s10 = "";
          this.m10 = "";
          this.h10 = "";
          this.timeTxt = "00:00:00";
          this.destroyDisabled = true;
          this.isRinging = false;
        } else {
          this.isRinging = false;
        }
      },
    },
    "$store.state.IsLogin": {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          console.log("登录");
          this.$notify.closeAll();

          setTimeout(() => {
            this.$notify({
              title: "成功",
              message: "拨打电话服务连接成功~",
              type: "success",
            });
          });
        } else {
          this.$notify({
            title: "重新连接",
            message: "请稍后，拨打电话服务正在重连~",
            duration: 0,
          });
          console.log("退出");
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.Tel {
  .handle {
    min-width: 695px;
  }
}
.tellInp {
  ::v-deep .el-input__inner {
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
</style>
