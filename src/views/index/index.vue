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
    <h1 v-else>呼叫中心</h1>
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
export default {
  components: {},
  data() {
    return {
      form: {
        user: "",
        passwd: "",
        url: "vertoweb.jvtdtest.top",
        prot: "8082",
      },
      loginDisabled: false,
    };
  },
  created() {
    const { user, passwd, url, prot } = this.form;
    init("2004", "123456", url, prot);
    logout()
  },
  mounted() {},
  computed: {
    IsLogin() {
      return this.$store.state.IsLogin;
    },
  },
  methods: {
    login() {
      const { user, passwd, url, prot } = this.form;

      login(user, passwd, url, prot);
    },
  },
  watch: {
    "$store.state.IsLogin": {
      immediate: true,
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          if (val) {
            this.loginDisabled = true;
            this.$message.success("登录成功！");
          } else {
            this.loginDisabled = false;
          }
          console.log( this.loginDisabled,'===== this.loginDisabled')
        });
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
