<template>
  <div class="index">
    <el-form :model="form">
      <el-form-item label="分机号：">
        <el-input v-model="form.user" placeholder="请输入分机号"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input v-model="form.passwd" type="password" placeholder="请输入密码"></el-input>
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
  </div>
</template>

<script>
import {login,init,onWSLogin,a,vertoHandle, vertoCallbacks, currentCall} from "../../layout/components/NavMenu/verto"
export default {
  components: {},
  data() {
    return {
      form:{
        user:'',
        passwd:'',
        url:'vertoweb.jvtdtest.top',
        prot:'8082',
      },
    };
  },
  created() {
    const {user,passwd,url,prot} = this.form
    init('2004','123456',url,prot)
  },
  mounted() {},
  computed: {},
  methods: {
    login(){
      const {user,passwd,url,prot} = this.form
      // init('2004','123456',url,prot)
      
      login(user,passwd,url,prot)
    }
  },
  watch: {
  },
};
</script>
<style lang="scss" scoped></style>
