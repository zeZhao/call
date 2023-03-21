<template>
  <div class="index">
    <el-form :model="form" v-if="!loginDisabled && isShowTel">
      <el-form-item label="分机号：">
        <el-input v-model="form.user" placeholder="请输入分机号"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input
          v-model="form.passwd"
          type="password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="连接地址：">
        <el-input v-model="form.url" placeholder="请输入连接地址"></el-input>
      </el-form-item>
      <el-form-item label="端口号：">
        <el-input v-model="form.prot" placeholder="请输入端口号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
    <div v-else>
      <h2>呼叫中心</h2>
      <video
        id="webcam"
        ref="webcam"
        autoplay="autoplay"
        style="width: 100%; height: 500px; object-fit: inherit; display: none"
      ></video>
    </div>
    
  </div>
</template>

<script>
import {
  login,
  logout,
  init,
  onWSLogin,
  vertoHandle,
  vertoCallbacks,
  currentCall,
} from "../../layout/components/NavMenu/verto";
import { setStorage, getStorage } from "@/utils/auth";
export default {
  components: {},
  data() {
    return {
      form: {
        user: JSON.parse(getStorage("info")).ext,
        passwd: JSON.parse(getStorage("info")).extPwd,
        url: JSON.parse(getStorage("info")).extUrl,
        prot: JSON.parse(getStorage("info")).extPort,
      },
      loginDisabled: false,
      isShowTel: false,
    };
  },
  created() {
     navigator.mediaDevices.getUserMedia({ audio: true })
    // var stream = navigator.mediaDevices.getUserMedia({ audio: true });
    // // 添加用户交互事件
    // document.body.addEventListener('click', function() {
    //     // 播放媒体流
    //     var audio = new Audio();
    //     audio.srcObject = stream;
    //     audio.play();
    // });

  },
  mounted() {
    if (JSON.parse(getStorage("info")) !== null) {
      const { ext, extPwd, extUrl, extPort } = JSON.parse(getStorage("info"));
      init(ext, extPwd, extUrl, extPort);
      const { sysMenus } = JSON.parse(getStorage("info"))
      if(sysMenus && sysMenus.length > 0){
        sysMenus.forEach(item=>{
          if(item.linkUrl === '/tel' && item.ifChecked === '1'){
            this.isShowTel = true
          }else{
            this.isShowTel = false
          }
        })
      }else{
        this.isShowTel = false
      }
    }
    // window.addEventListener("unload", (e) => this.logout(e));
  },
  computed: {
    IsLogin() {
      return this.$store.state.IsLogin;
    },
  },
  methods: {
    login() {
      const { ext, extPwd, extUrl, extPort } = JSON.parse(getStorage("info"));

      login(ext, extPwd, extUrl, extPort);
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
  beforeDestroy() {
    // window.removeEventListener('unload', this.logout);
    // this.logout();
    // window.removeEventListener("click");
  },
  watch: {
    "$store.state.IsLogin": {
      immediate: true,
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          if (val) {
            this.loginDisabled = true;
            // this.$message.success("登录成功！");
          } else {
            this.loginDisabled = false;
            // this.$message.error("分机登录失败，请重新登录");
          }
        });
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
