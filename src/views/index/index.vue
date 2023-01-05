<template>
  <div class="index">
    <el-form :model="form" v-if="!loginDisabled">
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
        <el-button type="primary" @click="login"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
    <div v-else>
      <h1>呼叫中心</h1>
      <video id="webcam" autoplay="autoplay" style="width:100%;height:500px;object-fit:inherit;display:none;"></video>
    </div>
  </div>
</template>

<script>
import {
  login,
  logout,
  init,
  onWSLogin,
  a,
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
        user: "",
        passwd: "",
        url: JSON.parse(getStorage('info')).extUrl,
        prot: JSON.parse(getStorage('info')).extPort,
      },
      loginDisabled: false,
    };
  },
  created() {
    const {ext,extPwd,extUrl,extPort} = JSON.parse(getStorage('info'))
    init(ext,extPwd,extUrl,extPort);
  },
  mounted() {},
  computed: {
    IsLogin() {
      return this.$store.state.IsLogin;
    },
  },
  methods: {
    login() {
      const {ext,extPwd,extUrl,extPort} = JSON.parse(getStorage('info'))

      login(ext,extPwd,extUrl,extPort);
    },
    logout() {
      this.$http.login.logout().then((res) => {
        console.log(res, "----");
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
  destroyed(){
    this.logout()
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
          console.log( this.loginDisabled,'===== this.loginDisabled')
        });
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
