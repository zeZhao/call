<template>
  <div class="index">
    <!-- <el-form :model="form" v-if="!loginDisabled && isShowTel">
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
    </el-form> -->
    <div>
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
  logout,
} from "../../layout/components/NavMenu/verto";
import { setStorage, getStorage } from "@/utils/auth";
export default {
  components: {},
  data() {
    return {
      // loginDisabled: false,
      isShowTel: false,
       _beforeUnload_time: '',
      _gap_time: ''
    };
  },
  created() {
     navigator.mediaDevices.getUserMedia({ audio: true })

  },
  mounted() {
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
    // window.addEventListener("beforeunload", (e) => {
    //   e.returnValue="关闭提示"
    //   this.logout()
    //   return '关闭提示'
      
    // });
  },
  computed: {
  },
  methods: {
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
     window.removeEventListener('beforeunload')
    window.removeEventListener('unload')
    // window.removeEventListener('beforeunload');
  },
  watch: {
  },
};
</script>
<style lang="scss" scoped></style>
