<template>
  <div class="login-container">
    <!-- <div class="head-logo">
      <img :src="logo" alt />
      <h3>短信导出工具</h3>
    </div> -->
    <div class="content clearfix">
      <div class="left">
        <h2 class="title">呼叫中心1</h2>
        <div class="img">
          <img src="@/assets/images/logo_banner@2x.png" alt="" />
        </div>
      </div>
      <div class="right">
        <div class="content_form">
          <h2 class="content_title">登录</h2>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login_form"
            autocomplete="on"
            label-position="left"
            label-width="100px"
          >
            <el-form-item prop="shortName" label="公司简称">
              <el-input
                ref="shortName"
                v-model="loginForm.shortName"
                placeholder="请输入公司简称"
                name="shortName"
                type="text"
                style="float: left"
              />
            </el-form-item>
            <el-form-item prop="jobNumber" label="工号">
              <el-input
                ref="jobNumber"
                v-model="loginForm.jobNumber"
                placeholder="请输入工号"
                name="jobNumber"
                type="text"
                style="float: left"
              />
            </el-form-item>

            <el-form-item prop="pwd" label="密码">
              <el-input
                v-model="loginForm.pwd"
                type="password"
                placeholder="请输入密码"
                show-pwd
                style="float: left"
              />
            </el-form-item>
            <el-form-item prop="verifyCode" label="验证码">
              <el-input
                v-model="loginForm.verifyCode"
                placeholder="请输入验证码"
                maxlength="4"
                style="float: left; width: 65%"
              ></el-input>
              <div class="captcha_code">
                <img :src="captcha" ref="code" @click="getCaptcha" />
              </div>
            </el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              class="loginBut"
              @click.native.prevent="handleLogin"
              >登录</el-button
            >
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/images/logo.png";
import { setStorage, getStorage,randomNum, getTime } from "@/utils/auth";
export default {
  name: "Login",
  data() {
    return {
      logo: logo,
      captcha: "",
      loginForm: {
        shortName: "",
        jobNumber: "",
        pwd: "",
        verifyCode: "",
        uuId: randomNum(),
      },
      loginRules: {
        // username: [{ trigger: "blur", validator: username }],
        shortName: [
          { required: true, trigger: "blur", message: "请输入公司简称" },
        ],
        jobNumber: [
          { required: true, trigger: "blur", message: "请输入工号" },
        ],
        pwd: [
          { required: true, trigger: "blur", message: "请输入密码" },
        ],
        verifyCode: [
          { required: true, trigger: "blur", message: "请输入验证码" },
        ],
        // password: [{ trigger: "blur", validator: validatePassword }],
        // verifyCode: [
        //   // { trigger: "blur", validator: validateVerifyCode },
        //   // { required: true, trigger: "blur", message: "请输入口令" },
        // ],
      },
      loading: false,
    };
  },
  created() {
  },
  mounted() {
    this.getCaptcha();
    window.addEventListener('keydown',this.keyDown);
  },
  methods: {
    keyDown(e){
      //如果是回车则执行登录方法
      if(e.keyCode == 13){
         this.handleLogin();
      }
    },
    getCaptcha() {
      const num = Math.ceil(Math.random() * 10); //生成一个随机数（防止缓存）
      this.captcha =
        process.env.VUE_APP_BASE_API +
        "/attend/captcha?uuId=" +
        this.loginForm.uuId +
        "&num=" +
        num;
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http.login.login(this.loginForm).then(res=>{
            if(res.state == '200'){
              setStorage('token',res.msg)
              setStorage('info',res.data)
              this.$router.push("/index");
              this.$message.success("登录成功");
              this.loading = false;
            }else{
              this.loading = false;
              this.getCaptcha()
              this.$message.error(res.msg)
            }
          }).catch(()=>{
            this.loading = false;
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  destroyed(){
  window.removeEventListener('keydown',this.keyDown,false);
}
};
</script>

<style lang="scss" scoped>
$bg: #f8ffff;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  height: 100vh;
  width: 100%;
  background-color: $bg;
  background: url("../../assets/images/logo_back@2x.png") no-repeat;
  background-size: cover;
  overflow: hidden;
  .content {
    width: 1076px;
    margin: 180px auto 0;
    .left {
      width: 472px;
      float: left;
      text-align: center;
      .title {
        height: 40px;
        font-family: PingFangSC-Medium;
        font-weight: Medium;
        font-size: 28px;
        color: #2b2f36;
        margin-bottom: 48px;
        margin-top: 56px;
      }
      .img {
        width: 472px;
        height: 312px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .right {
      float: right;
      .content_form {
        width: 480px;
        height: 540px;
        background: #ffffff;
        box-shadow: 0 5px 20px 0 rgba(31, 35, 41, 0.05);
        text-align: center;
        padding: 48px;
        box-sizing: border-box;
        .content_title {
          margin-top: 8px;
          margin-bottom: 40px;
          font-family: PingFangSC-Medium;
          font-weight: Medium;
          font-size: 28px;
          color: #2b2f36;
        }
        .login_form {
          ::v-deep .el-form-item {
            border: 1px solid #d7dae0;
            border-radius: 4px;
            margin-bottom: 24px;
          }
          ::v-deep .el-form-item__label {
            padding-left: 16px;
          }
          ::v-deep .el-input__inner {
            border: none;
            padding-left: 8px;
          }
          ::v-deep .el-form-item__content {
            height: 40px;
          }
          ::v-deep .el-form-item__error {
            padding-top: 8px;
            left: -100px;
          }
          .loginBut {
            width: 100%;
            margin-top: 52px;
          }

          .captcha_code {
            width: 95px;
            height: 35px;
            display: inline-block;
            text-align: right;
            height: 40px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }

  .login_box {
    width: 1000px;
    display: block;
    margin: 0 auto;
    vertical-align: middle;
    position: relative;
    top: 10%; /*偏移*/
    transform: translateY(10%);
  }
  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
  @media only screen and (max-width: 1550px) {
    .login_box {
      transform: translateY(20%);
    }
  }
  @media only screen and (max-width: 1311px) {
    .login_box {
      transform: translateY(10%);
    }
  }
  @media only screen and (max-width: 1222px) {
    .login_box {
      transform: translateY(8%);
    }
  }
}
</style>
